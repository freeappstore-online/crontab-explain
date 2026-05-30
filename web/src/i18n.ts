export type Locale = 'vi' | 'en'

export interface FieldDef {
  id: string
  label: string
  placeholder: string
  range: string
}

export interface Example {
  label: string
  description: string
  expressions: Record<5 | 6 | 7, string>
}

export interface Translations {
  locale: Locale
  subtitle: string
  formatSection: string
  formatLabels: Record<5 | 6 | 7, string>
  builderSection: string
  exprLabel: string
  examplesSection: string
  explanationSection: string
  fieldAnalysisSection: string
  nextRunsSection: string
  nextRunsSuffix: string
  tableField: string
  tableValue: string
  tableRange: string
  tableMeaning: string
  specialsTitle: string
  specials: { char: string; desc: string }[]
  validBadge: string
  errorBadge: string
  nextBadge: string
  errorPrefix: (needed: number, got: number) => string
  fields5: FieldDef[]
  fields6: FieldDef[]
  fields7: FieldDef[]
  examples: Example[]
  describeField: (fieldId: string, value: string) => string
  weekdayShort: string[]
}

const EXPRS: Example['expressions'][] = [
  { 5: '* * * * *',      6: '0 * * * * *',      7: '0 * * * * * *'   },
  { 5: '0 * * * *',      6: '0 0 * * * *',      7: '0 0 * * * * *'   },
  { 5: '*/5 * * * *',    6: '0 */5 * * * *',    7: '0 */5 * * * * *' },
  { 5: '*/15 * * * *',   6: '0 */15 * * * *',   7: '0 */15 * * * * *'},
  { 5: '0,30 * * * *',   6: '0 0,30 * * * *',   7: '0 0,30 * * * * *'},
  { 5: '0 0 * * *',      6: '0 0 0 * * *',      7: '0 0 0 * * * *'   },
  { 5: '0 6 * * *',      6: '0 0 6 * * *',      7: '0 0 6 * * * *'   },
  { 5: '0 12 * * *',     6: '0 0 12 * * *',     7: '0 0 12 * * * *'  },
  { 5: '0 9 * * 1-5',    6: '0 0 9 * * 1-5',    7: '0 0 9 * * 1-5 *' },
  { 5: '0 0 * * 0',      6: '0 0 0 * * 0',      7: '0 0 0 * * 0 *'   },
  { 5: '0 0 1 * *',      6: '0 0 0 1 * *',      7: '0 0 0 1 * * *'   },
  { 5: '0 0 1 */3 *',    6: '0 0 0 1 */3 *',    7: '0 0 0 1 */3 * *' },
  { 5: '0 0 1 1 *',      6: '0 0 0 1 1 *',      7: '0 0 0 1 1 * *'   },
]

export const VI: Translations = {
  locale: 'vi',
  subtitle: 'Phân tích và giải thích biểu thức Cron theo thời gian thực',
  formatSection: 'Định dạng',
  formatLabels: { 5: '5 trường (chuẩn)', 6: '6 trường (+ giây)', 7: '7 trường (+ giây + năm)' },
  builderSection: 'Xây dựng biểu thức',
  exprLabel: 'Biểu thức Cron',
  examplesSection: 'Ví Dụ Phổ Biến',
  explanationSection: 'Giải Thích',
  fieldAnalysisSection: 'Phân Tích Từng Trường',
  nextRunsSection: 'Các Lần Chạy Tiếp Theo',
  nextRunsSuffix: '(tính từ thời điểm hiện tại, múi giờ UTC)',
  tableField: 'Trường',
  tableValue: 'Giá trị',
  tableRange: 'Phạm vi',
  tableMeaning: 'Ý nghĩa',
  specialsTitle: 'Ký hiệu đặc biệt',
  specials: [
    { char: '*', desc: 'Mọi giá trị' },
    { char: '?', desc: 'Bất kỳ (ngày/thứ)' },
    { char: '-', desc: 'Khoảng (VD: 1-5)' },
    { char: ',', desc: 'Danh sách (VD: 1,3,5)' },
    { char: '/', desc: 'Bước nhảy (VD: */5)' },
    { char: 'L', desc: 'Ngày cuối tháng/tuần' },
  ],
  validBadge: 'Hợp lệ',
  errorBadge: 'Lỗi',
  nextBadge: 'Kế tiếp',
  errorPrefix: (n, g) => `Cần ${n} trường, nhưng có ${g} trường`,
  weekdayShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  fields5: [
    { id: 'minute',  label: 'Phút',  placeholder: '*', range: '0-59' },
    { id: 'hour',    label: 'Giờ',   placeholder: '*', range: '0-23' },
    { id: 'day',     label: 'Ngày',  placeholder: '*', range: '1-31' },
    { id: 'month',   label: 'Tháng', placeholder: '*', range: '1-12 hoặc JAN-DEC' },
    { id: 'weekday', label: 'Thứ',   placeholder: '*', range: '0-7 hoặc SUN-SAT' },
  ],
  get fields6() { return [{ id: 'second', label: 'Giây', placeholder: '0', range: '0-59' }, ...this.fields5] },
  get fields7() { return [...this.fields6, { id: 'year', label: 'Năm', placeholder: '*', range: '1970-2099' }] },
  describeField(fieldId, value) {
    if (value === '*') return 'Mọi giá trị'
    if (value === '?') return 'Bất kỳ (không xác định)'
    if (value.startsWith('*/')) {
      const n = value.slice(2)
      const u: Record<string, string> = { second: 'giây', minute: 'phút', hour: 'giờ', day: 'ngày', month: 'tháng', weekday: 'ngày', year: 'năm' }
      return `Mỗi ${n} ${u[fieldId] || 'đơn vị'}`
    }
    if (value.includes('-') && !value.includes(',')) {
      const [a, b] = value.split('-')
      return `Từ ${a} đến ${b}`
    }
    if (value.includes(',')) return `Các giá trị: ${value}`
    const weekdayMap: Record<string, string> = { '0': 'Chủ nhật', '1': 'Thứ Hai', '2': 'Thứ Ba', '3': 'Thứ Tư', '4': 'Thứ Năm', '5': 'Thứ Sáu', '6': 'Thứ Bảy', '7': 'Chủ nhật' }
    if (fieldId === 'weekday' && weekdayMap[value]) return weekdayMap[value]
    return `Chính xác: ${value}`
  },
  examples: [
    { label: 'Mỗi phút',               description: 'Chạy vào đầu mỗi phút',           expressions: EXPRS[0] },
    { label: 'Mỗi giờ',                description: 'Chạy vào đầu mỗi giờ',            expressions: EXPRS[1] },
    { label: 'Mỗi 5 phút',             description: 'Chạy mỗi 5 phút',                 expressions: EXPRS[2] },
    { label: 'Mỗi 15 phút',            description: 'Chạy mỗi 15 phút',                expressions: EXPRS[3] },
    { label: 'Mỗi 30 phút',            description: 'Chạy vào phút 0 và 30',           expressions: EXPRS[4] },
    { label: 'Nửa đêm hàng ngày',      description: 'Chạy lúc 00:00 mỗi ngày',        expressions: EXPRS[5] },
    { label: '6 giờ sáng hàng ngày',   description: 'Chạy lúc 06:00 mỗi ngày',        expressions: EXPRS[6] },
    { label: '12 giờ trưa hàng ngày',  description: 'Chạy lúc 12:00 mỗi ngày',        expressions: EXPRS[7] },
    { label: 'Ngày trong tuần 9 giờ',  description: 'T2–T6 lúc 09:00',                 expressions: EXPRS[8] },
    { label: 'Hàng tuần (Chủ nhật)',   description: 'Chạy lúc 00:00 mỗi Chủ nhật',    expressions: EXPRS[9] },
    { label: 'Đầu mỗi tháng',         description: 'Chạy lúc 00:00 ngày 1 hàng tháng', expressions: EXPRS[10] },
    { label: 'Hàng quý',              description: 'Chạy ngày 1 mỗi 3 tháng',          expressions: EXPRS[11] },
    { label: 'Đầu năm (1/1)',         description: 'Chạy lúc 00:00 ngày 1 tháng 1',    expressions: EXPRS[12] },
  ],
}

export const EN: Translations = {
  locale: 'en',
  subtitle: 'Parse and explain Cron expressions in real-time',
  formatSection: 'Format',
  formatLabels: { 5: '5 fields (standard)', 6: '6 fields (+ second)', 7: '7 fields (+ second + year)' },
  builderSection: 'Expression Builder',
  exprLabel: 'Cron Expression',
  examplesSection: 'Common Examples',
  explanationSection: 'Explanation',
  fieldAnalysisSection: 'Field Analysis',
  nextRunsSection: 'Next Scheduled Runs',
  nextRunsSuffix: '(from now, UTC timezone)',
  tableField: 'Field',
  tableValue: 'Value',
  tableRange: 'Range',
  tableMeaning: 'Meaning',
  specialsTitle: 'Special characters',
  specials: [
    { char: '*', desc: 'Any value' },
    { char: '?', desc: 'Any (day/weekday)' },
    { char: '-', desc: 'Range (e.g. 1-5)' },
    { char: ',', desc: 'List (e.g. 1,3,5)' },
    { char: '/', desc: 'Step (e.g. */5)' },
    { char: 'L', desc: 'Last day of month/week' },
  ],
  validBadge: 'Valid',
  errorBadge: 'Error',
  nextBadge: 'Next',
  errorPrefix: (n, g) => `Expected ${n} fields, but got ${g}`,
  weekdayShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  fields5: [
    { id: 'minute',  label: 'Minute',  placeholder: '*', range: '0-59' },
    { id: 'hour',    label: 'Hour',    placeholder: '*', range: '0-23' },
    { id: 'day',     label: 'Day',     placeholder: '*', range: '1-31' },
    { id: 'month',   label: 'Month',   placeholder: '*', range: '1-12 or JAN-DEC' },
    { id: 'weekday', label: 'Weekday', placeholder: '*', range: '0-7 or SUN-SAT' },
  ],
  get fields6() { return [{ id: 'second', label: 'Second', placeholder: '0', range: '0-59' }, ...this.fields5] },
  get fields7() { return [...this.fields6, { id: 'year', label: 'Year', placeholder: '*', range: '1970-2099' }] },
  describeField(fieldId, value) {
    if (value === '*') return 'Any value'
    if (value === '?') return 'Any (unspecified)'
    if (value.startsWith('*/')) {
      const n = value.slice(2)
      const u: Record<string, string> = { second: 'second(s)', minute: 'minute(s)', hour: 'hour(s)', day: 'day(s)', month: 'month(s)', weekday: 'day(s)', year: 'year(s)' }
      return `Every ${n} ${u[fieldId] || 'unit(s)'}`
    }
    if (value.includes('-') && !value.includes(',')) {
      const [a, b] = value.split('-')
      return `From ${a} to ${b}`
    }
    if (value.includes(',')) return `Values: ${value}`
    const weekdayMap: Record<string, string> = { '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday' }
    if (fieldId === 'weekday' && weekdayMap[value]) return weekdayMap[value]
    return `Exact: ${value}`
  },
  examples: [
    { label: 'Every minute',          description: 'Run at the start of every minute',    expressions: EXPRS[0] },
    { label: 'Every hour',            description: 'Run at the start of every hour',      expressions: EXPRS[1] },
    { label: 'Every 5 minutes',       description: 'Run every 5 minutes',                 expressions: EXPRS[2] },
    { label: 'Every 15 minutes',      description: 'Run every 15 minutes',                expressions: EXPRS[3] },
    { label: 'Every 30 minutes',      description: 'Run at minute 0 and 30',              expressions: EXPRS[4] },
    { label: 'Daily at midnight',     description: 'Run at 00:00 every day',              expressions: EXPRS[5] },
    { label: 'Daily at 6 AM',         description: 'Run at 06:00 every day',              expressions: EXPRS[6] },
    { label: 'Daily at noon',         description: 'Run at 12:00 every day',              expressions: EXPRS[7] },
    { label: 'Weekdays at 9 AM',      description: 'Mon–Fri at 09:00',                    expressions: EXPRS[8] },
    { label: 'Weekly (Sunday)',        description: 'Run at 00:00 every Sunday',           expressions: EXPRS[9] },
    { label: 'Monthly (1st)',          description: 'Run at 00:00 on the 1st of the month', expressions: EXPRS[10] },
    { label: 'Quarterly',             description: 'Run on the 1st every 3 months',        expressions: EXPRS[11] },
    { label: 'Yearly (Jan 1)',        description: 'Run at 00:00 on January 1st',          expressions: EXPRS[12] },
  ],
}

export const LOCALES: Record<Locale, Translations> = { vi: VI, en: EN }
