export type TimeRange = string
export type Day = '(L) Lunes' | '(K) Martes' | '(M) Miércoles' | '(J) Jueves' | '(V) Viernes' | '(S) Sábado' | '(D) Domingo'

interface ScheduleCell {
  hour: TimeRange
  day: Day
}