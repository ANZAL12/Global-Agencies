-- Supabase SQL Editor Script: admin_create_promoter
-- This script creates an RPC function to securely create a promoter account
-- bypassing the GoTrue client-side email rate limits and auto-confirming the email.

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cleanup the old broken trigger that causes "confirmed_at can only be updated to DEFAULT"
-- Dropping from BOTH public.users and auth.users just in case it was created on the wrong table!
DROP TRIGGER IF EXISTS tr_auto_confirm_user ON public.users;
DROP TRIGGER IF EXISTS tr_auto_confirm_user ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user() CASCADE;

-- Create the RPC function
CREATE OR REPLACE FUNCTION admin_create_promoter(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_shop_name TEXT,
  p_phone_number TEXT,
  p_gpay_number TEXT
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  new_user_id UUID;
  encrypted_pw TEXT;
BEGIN
  -- 1. Create a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- 2. Hash the password using GoTrue's expected blowfish scheme
  encrypted_pw := crypt(p_password, gen_salt('bf'));
  
  -- 3. Insert into auth.users (Managed by Supabase GoTrue)
  BEGIN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      p_email,
      encrypted_pw,
      now(),
      NULL,
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'Failed during auth.users insert: ' || SQLERRM);
  END;

  -- 4. Insert into auth.identities
  BEGIN
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      new_user_id,
      new_user_id::text,
      format('{"sub":"%s","email":"%s"}', new_user_id::text, p_email)::jsonb,
      'email',
      now(),
      now(),
      now()
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'Failed during auth.identities insert: ' || SQLERRM);
  END;

  -- 5. Insert directly into public.users
  -- Disable user triggers temporarily to bypass ANY rogue old triggers connected to this!
  BEGIN
    ALTER TABLE public.users DISABLE TRIGGER USER;
    
    INSERT INTO public.users (
      id,
      email,
      role,
      full_name,
      shop_name,
      phone_number,
      gpay_number,
      is_active
    ) VALUES (
      new_user_id,
      p_email,
      'promoter',
      p_full_name,
      p_shop_name,
      p_phone_number,
      p_gpay_number,
      true
    );
    
    ALTER TABLE public.users ENABLE TRIGGER USER;
  EXCEPTION WHEN OTHERS THEN
    -- Ensure we re-enable user triggers even if the insert fails
    ALTER TABLE public.users ENABLE TRIGGER USER;
    RETURN jsonb_build_object('error', 'Failed during public.users insert: ' || SQLERRM);
  END;

  -- 6. Return success with the new user_id
  RETURN jsonb_build_object('success', true, 'user_id', new_user_id);

END;
$$;
