-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ACADEMIC YEARS (6NF)
-- ============================================================================
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE academic_year_labels (
  academic_year_id UUID PRIMARY KEY REFERENCES academic_years(id) ON DELETE CASCADE,
  label TEXT NOT NULL UNIQUE
);

CREATE TABLE academic_year_start_dates (
  academic_year_id UUID PRIMARY KEY REFERENCES academic_years(id) ON DELETE CASCADE,
  start_date DATE NOT NULL
);

CREATE TABLE academic_year_end_dates (
  academic_year_id UUID PRIMARY KEY REFERENCES academic_years(id) ON DELETE CASCADE,
  end_date DATE NOT NULL
);

CREATE TABLE academic_year_active_statuses (
  academic_year_id UUID PRIMARY KEY REFERENCES academic_years(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT false
);

-- ============================================================================
-- 2. LEVELS AND GROUPS (Separated 1-to-N, 6NF)
-- ============================================================================
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE level_names (
  level_id UUID PRIMARY KEY REFERENCES levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE group_names (
  group_id UUID PRIMARY KEY REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE TABLE group_level_assignments (
  group_id UUID PRIMARY KEY REFERENCES groups(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE RESTRICT
);

-- ============================================================================
-- 3. STUDENTS (6NF with optional extra_info JSON field defaulting to NULL)
-- ============================================================================

CREATE TYPE student_gender_enum AS ENUM ('male', 'female', 'undefined');

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE student_process_numbers (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  process_number TEXT NOT NULL UNIQUE
);

CREATE TABLE student_names (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE TABLE student_birthdates (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  birthdate DATE
);

CREATE TABLE student_photo_urls (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  photo_url TEXT
);

CREATE TABLE student_genders (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  gender student_gender_enum NOT NULL DEFAULT 'undefined'
);

CREATE TABLE student_extra_infos (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  extra_info JSONB DEFAULT NULL
);

-- ============================================================================
-- 4. STUDENT ENROLMENTS (6NF)
-- ============================================================================
CREATE TABLE student_enrolments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE enrolment_students (
  enrolment_id UUID PRIMARY KEY REFERENCES student_enrolments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE enrolment_groups (
  enrolment_id UUID PRIMARY KEY REFERENCES student_enrolments(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE RESTRICT
);

CREATE TABLE enrolment_academic_years (
  enrolment_id UUID PRIMARY KEY REFERENCES student_enrolments(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT
);

CREATE TABLE enrolment_group_numbers (
  enrolment_id UUID PRIMARY KEY REFERENCES student_enrolments(id) ON DELETE CASCADE,
  group_number INT NOT NULL
);

-- ============================================================================
-- 5. GUARDIANS & STUDENT-GUARDIAN RELATIONSHIPS (6NF)
-- ============================================================================
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE guardian_names (
  guardian_id UUID PRIMARY KEY REFERENCES guardians(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE TABLE guardian_phones (
  guardian_id UUID PRIMARY KEY REFERENCES guardians(id) ON DELETE CASCADE,
  phone_number TEXT
);

CREATE TABLE guardian_emails (
  guardian_id UUID PRIMARY KEY REFERENCES guardians(id) ON DELETE CASCADE,
  email TEXT
);

CREATE TABLE student_guardians (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID REFERENCES guardians(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, guardian_id)
);

CREATE TABLE student_guardian_relationships (
  student_id UUID,
  guardian_id UUID,
  relationship TEXT NOT NULL,
  PRIMARY KEY (student_id, guardian_id),
  FOREIGN KEY (student_id, guardian_id) REFERENCES student_guardians(student_id, guardian_id) ON DELETE CASCADE
);

-- ============================================================================
-- 6. PLANNING UNITS (Belongs to Academic Year, Level, OR Group, 6NF)
-- ============================================================================
CREATE TABLE planning_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE planning_unit_themes (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  theme TEXT NOT NULL
);

CREATE TABLE planning_unit_activities (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  activities TEXT
);

CREATE TABLE planning_unit_manual_pages (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  manual_pages TEXT
);

CREATE TABLE planning_unit_resources_physical (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  resources_physical TEXT
);

CREATE TABLE planning_unit_resources_digital (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  resources_digital TEXT
);

CREATE TABLE planning_unit_exercises_physical (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  exercises_physical TEXT
);

CREATE TABLE planning_unit_exercises_digital (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  exercises_digital TEXT
);

CREATE TABLE planning_unit_registers (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  registers TEXT
);

-- Associations for Planning Units (6NF Optional Target Scopes)
CREATE TABLE planning_unit_academic_years (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE
);

CREATE TABLE planning_unit_levels (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE
);

CREATE TABLE planning_unit_groups (
  planning_unit_id UUID PRIMARY KEY REFERENCES planning_units(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. LESSONS (With Date and Time, 6NF)
-- ============================================================================

-- Create Enum Type for Lesson Duration
CREATE TYPE lesson_duration_enum AS ENUM ('45', '50', '90', '100');

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE lesson_academic_years (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT
);

CREATE TABLE lesson_groups (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE RESTRICT
);

CREATE TABLE lesson_subjects (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  subject TEXT NOT NULL
);

CREATE TABLE lesson_numbers (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_number TEXT NOT NULL
);

CREATE TABLE lesson_dates (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_date DATE NOT NULL
);

CREATE TABLE lesson_times (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_time TIME NOT NULL
);

-- Create Lesson Durations Table
CREATE TABLE lesson_durations (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  duration lesson_duration_enum NOT NULL
);

CREATE TABLE lesson_summaries (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  summary TEXT
);

CREATE TABLE lesson_attention_boxes (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  attention_box TEXT
);

CREATE TABLE lesson_teacher_notes (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  teacher_notes TEXT
);

CREATE TABLE lesson_step_by_steps (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  step_by_step JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE lesson_materials (
  lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  materials JSONB DEFAULT '[]'::jsonb
);

-- ============================================================================
-- 8. EVALUATIONS (6NF)
-- ============================================================================
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE evaluation_lessons (
  evaluation_id UUID PRIMARY KEY REFERENCES evaluations(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE evaluation_students (
  evaluation_id UUID PRIMARY KEY REFERENCES evaluations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE evaluation_attending_statuses (
  evaluation_id UUID PRIMARY KEY REFERENCES evaluations(id) ON DELETE CASCADE,
  is_attending BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE evaluation_student_ratings (
  evaluation_id UUID PRIMARY KEY REFERENCES evaluations(id) ON DELETE CASCADE,
  student_rating INT CHECK (student_rating BETWEEN 1 AND 5)
);

CREATE TABLE evaluation_teacher_ratings (
  evaluation_id UUID PRIMARY KEY REFERENCES evaluations(id) ON DELETE CASCADE,
  teacher_rating INT CHECK (teacher_rating BETWEEN 1 AND 5)
);

CREATE TABLE evaluation_notes (
  evaluation_id UUID PRIMARY KEY REFERENCES evaluations(id) ON DELETE CASCADE,
  notes TEXT
);

-- ============================================================================
-- RLS POLICIES FOR ALL TABLES
-- ============================================================================
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_year_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_year_start_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_year_end_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_year_active_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_level_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_process_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_birthdates ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_photo_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_genders ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_extra_infos ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolment_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolment_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolment_academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolment_group_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardian_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_manual_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_resources_physical ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_resources_digital ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_exercises_physical ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_exercises_digital ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_unit_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attention_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_teacher_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_step_by_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_attending_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_student_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_teacher_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_notes ENABLE ROW LEVEL SECURITY;

-- Allow public access policy helper
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema='public' AND table_type='BASE TABLE'
  LOOP
    EXECUTE format('CREATE POLICY "Allow public access" ON %I FOR ALL USING (true);', t);
  END LOOP;
END $$;

-- ============================================================================
-- Function that returns the next lesson number based on the last lesson number
-- for a given group and duration
-- ============================================================================

CREATE OR REPLACE FUNCTION get_next_lesson_number(
  p_group_id UUID,
  p_duration lesson_duration_enum
) RETURNS TEXT AS $$
DECLARE
  v_last_number_str TEXT;
  v_last_num INT := 0;
  v_next_num INT;
  v_result TEXT;
BEGIN
  -- Get the most recent lesson_number for the given group
  SELECT ln.lesson_number INTO v_last_number_str
  FROM lessons l
  JOIN lesson_groups lg ON l.id = lg.lesson_id
  JOIN lesson_numbers ln ON l.id = ln.lesson_id
  JOIN lesson_dates ld ON l.id = ld.lesson_id
  JOIN lesson_times lt ON l.id = lt.lesson_id
  WHERE lg.group_id = p_group_id
  ORDER BY ld.lesson_date DESC, lt.lesson_time DESC
  LIMIT 1;

  -- Extract the last integer if lesson_number was a double (e.g. "13 e 14" -> 14, or "12" -> 12)
  IF v_last_number_str IS NOT NULL THEN
    v_last_num := (regexp_matches(v_last_number_str, '\d+', 'g'))[1]::INT;
  END IF;

  v_next_num := v_last_num + 1;

  -- Format result based on duration
  IF p_duration IN ('45', '50') THEN
    v_result := v_next_num::TEXT;
  ELSIF p_duration IN ('90', '100') THEN
    v_result := v_next_num::TEXT || ' e ' || (v_next_num + 1)::TEXT;
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CONVENIENCE READ VIEWS (FLATTENS 6NF FOR APPLICATION SERVICE LAYERS)
-- ============================================================================

CREATE OR REPLACE VIEW view_students AS
SELECT 
  s.id,
  spn.process_number,
  sn.name,
  sb.birthdate,
  COALESCE(sg.gender, 'undefined'::student_gender_enum) AS gender,
  sp.photo_url,
  se.extra_info
FROM students s
LEFT JOIN student_process_numbers spn ON s.id = spn.student_id
LEFT JOIN student_names sn ON s.id = sn.student_id
LEFT JOIN student_birthdates sb ON s.id = sb.student_id
LEFT JOIN student_genders sg ON s.id = sg.student_id
LEFT JOIN student_photo_urls sp ON s.id = sp.student_id
LEFT JOIN student_extra_infos se ON s.id = se.student_id;

CREATE OR REPLACE VIEW view_lessons AS
SELECT 
  l.id,
  lay.academic_year_id,
  lg.group_id,
  ls.subject,
  ln.lesson_number,
  ldur.duration,
  ld.lesson_date,
  lt.lesson_time,
  lsum.summary,
  lab.attention_box,
  ltn.teacher_notes,
  lsbs.step_by_step,
  lm.materials
FROM lessons l
LEFT JOIN lesson_academic_years lay ON l.id = lay.lesson_id
LEFT JOIN lesson_groups lg ON l.id = lg.lesson_id
LEFT JOIN lesson_subjects ls ON l.id = ls.lesson_id
LEFT JOIN lesson_numbers ln ON l.id = ln.lesson_id
LEFT JOIN lesson_durations ldur ON l.id = ldur.lesson_id
LEFT JOIN lesson_dates ld ON l.id = ld.lesson_id
LEFT JOIN lesson_times lt ON l.id = lt.lesson_id
LEFT JOIN lesson_summaries lsum ON l.id = lsum.lesson_id
LEFT JOIN lesson_attention_boxes lab ON l.id = lab.lesson_id
LEFT JOIN lesson_teacher_notes ltn ON l.id = ltn.lesson_id
LEFT JOIN lesson_step_by_steps lsbs ON l.id = lsbs.lesson_id
LEFT JOIN lesson_materials lm ON l.id = lm.lesson_id;