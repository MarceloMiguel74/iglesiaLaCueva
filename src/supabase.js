import { createClient } from '@supabase/supabase-js'

// Reemplaza estas dos variables con los datos de tu proyecto en Supabase
const supabaseUrl = 'https://ifbrdjxqfgauutydjvgo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYnJkanhxZmdhdXV0eWRqdmdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMTEyMjYsImV4cCI6MjEwMjU4NzIyNn0.BwFOX0InJTOz1qnhwwfO6nBGuGVlKsTtmyG74QpM1gA' // Asegúrate de tener la variable de entorno configurada correctamente

export const supabase = createClient(supabaseUrl, supabaseKey)