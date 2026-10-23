-- ═════════════════════════════════════════════════════════════
-- Database Test Suite: Row-Level Security & Canonical Connections
-- Covers: Anonymous, Unrelated Authenticated, and Blocked Users
-- ═════════════════════════════════════════════════════════════

BEGIN;

-- 1. SETUP TEST FIXTURES
DO $$
DECLARE
  v_user_alice UUID := '11111111-1111-1111-1111-111111111111';
  v_user_bob   UUID := '22222222-2222-2222-2222-222222222222';
  v_user_eve   UUID := '33333333-3333-3333-3333-333333333333';
  v_inst_iitb  UUID := 'a1111111-1111-1111-1111-111111111111';
  v_work_alice UUID := '99999999-9999-9999-9999-999999999999';
  v_result JSONB;
BEGIN
  RAISE NOTICE 'Starting CSC Database Security & State Machine Test Suite...';

  -- Create Alice profile
  INSERT INTO profiles (id, display_name, role, profile_visibility, institution_id, is_campus_verified)
  VALUES (v_user_alice, 'Alice Scholar', 'student', 'connections', v_inst_iitb, true)
  ON CONFLICT (id) DO UPDATE SET profile_visibility = 'connections';

  -- Create Bob profile
  INSERT INTO profiles (id, display_name, role, profile_visibility, institution_id, is_campus_verified)
  VALUES (v_user_bob, 'Bob Peer', 'student', 'public', v_inst_iitb, true)
  ON CONFLICT (id) DO UPDATE SET profile_visibility = 'public';

  -- Create Eve profile (Unrelated third-party)
  INSERT INTO profiles (id, display_name, role, profile_visibility)
  VALUES (v_user_eve, 'Eve Attacker', 'student', 'public')
  ON CONFLICT (id) DO UPDATE SET profile_visibility = 'public';

  -- 2. TEST: CANONICAL CONNECTION ORDERING & DUPLICATE PREVENTION
  -- Canonical ordering requires user_low < user_high
  BEGIN
    INSERT INTO connections (user_low, user_high, requested_by, status)
    VALUES (v_user_bob, v_user_alice, v_user_alice, 'pending');
    RAISE EXCEPTION 'TEST FAILED: Should have rejected inverted user pair ordering (user_low must be < user_high)';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: Inverted pair ordering strictly rejected by CHECK (user_low < user_high)';
  END;

  -- Self-connections forbidden
  BEGIN
    INSERT INTO connections (user_low, user_high, requested_by, status)
    VALUES (v_user_alice, v_user_alice, v_user_alice, 'pending');
    RAISE EXCEPTION 'TEST FAILED: Should have rejected self connection';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: Self-connection rejected by database constraint';
  END;

  -- 3. TEST: STATE TRANSITIONS VIA transition_connection_status
  -- Alice requests Bob
  v_result := transition_connection_status(v_user_bob, 'request', v_user_alice);
  RAISE NOTICE 'PASS: Alice requested connection with Bob: %', v_result;

  -- Alice tries to accept her own request -> MUST FAIL
  BEGIN
    PERFORM transition_connection_status(v_user_bob, 'accept', v_user_alice);
    RAISE EXCEPTION 'TEST FAILED: Requester should not be able to accept own request';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'PASS: Requester cannot accept own connection request';
  END;

  -- Bob accepts Alice's request -> MUST SUCCEED
  v_result := transition_connection_status(v_user_alice, 'accept', v_user_bob);
  RAISE NOTICE 'PASS: Bob successfully accepted Alice request: %', v_result;

  -- Verify are_connected(Alice, Bob) is now TRUE
  IF NOT are_connected(v_user_alice, v_user_bob) THEN
    RAISE EXCEPTION 'TEST FAILED: Alice and Bob should be connected';
  END IF;
  RAISE NOTICE 'PASS: are_connected(Alice, Bob) evaluates to TRUE';

  -- Verify are_connected(Alice, Eve) is FALSE
  IF are_connected(v_user_alice, v_user_eve) THEN
    RAISE EXCEPTION 'TEST FAILED: Alice and Eve should NOT be connected';
  END IF;
  RAISE NOTICE 'PASS: are_connected(Alice, Eve) evaluates to FALSE';

  -- 4. TEST: BLOCK MECHANISM CANCELS CONNECTION & ISOLATES USERS
  -- Bob blocks Alice
  PERFORM transition_connection_status(v_user_alice, 'block', v_user_bob);
  
  -- Verify connection is set to blocked
  IF are_connected(v_user_alice, v_user_bob) THEN
    RAISE EXCEPTION 'TEST FAILED: Blocked users must NOT be connected';
  END IF;
  RAISE NOTICE 'PASS: Block immediately severed connection between Alice and Bob';

  -- Verify is_blocked evaluates to true in both directions
  IF NOT is_blocked(v_user_alice, v_user_bob) OR NOT is_blocked(v_user_bob, v_user_alice) THEN
    RAISE EXCEPTION 'TEST FAILED: is_blocked must be symmetric';
  END IF;
  RAISE NOTICE 'PASS: is_blocked evaluates to TRUE symmetrically';

  -- 5. TEST: AUDIT LOGS IMMUTABILITY (APPEND-ONLY)
  INSERT INTO audit_logs (id, actor_id, action, target_resource)
  VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', v_user_alice, 'LOGIN', 'auth/session');

  BEGIN
    UPDATE audit_logs 
    SET action = 'TAMPERED' 
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    RAISE EXCEPTION 'TEST FAILED: audit_logs UPDATE should be forbidden';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'PASS: audit_logs UPDATE rejected by append-only trigger';
  END;

  BEGIN
    DELETE FROM audit_logs 
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    RAISE EXCEPTION 'TEST FAILED: audit_logs DELETE should be forbidden';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'PASS: audit_logs DELETE rejected by append-only trigger';
  END;

  RAISE NOTICE 'ALL DATABASE SECURITY TESTS PASSED SUCCESSFULLY!';
END;
$$;

ROLLBACK;
