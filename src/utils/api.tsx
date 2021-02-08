import { Course, Degree, Shift } from './domain'

export default class API {
	private static ACADEMIC_TERM = '2020/2021';

	private static async getRequest(url: string): Promise<any> {
		return await fetch('/horarios' + url).then(r => {
			const contentType = r.headers.get('content-type')
			if (contentType?.includes('application/json') && r.status === 200) {
				return r.json()
			} else if (contentType?.includes('text/plain')) {
				return r.text()
			} else {
				return null
			}
		})
	}

	public static async getDegrees(): Promise<Degree[] | null> {
		let res = await this.getRequest(`/api/degrees?academicTerm=${this.ACADEMIC_TERM}`)
		if (res === null) {
			return null
		}
		res = res.map((d: any) => new Degree(d))
		res.sort(Degree.compare)
		return res
	}

	public static async getCourses(degree: string): Promise<Course[] | null> {
		let res = await this.getRequest(`/api/degrees/${degree}/courses?academicTerm=${this.ACADEMIC_TERM}`)
		if (res === null) {
			return null
		}
		res = res
			.map((d: any) => new Course(d))
			.filter( (c: Course) => {
				// FIXME: hardcoded
				return c.semester === 2
			})
		res.sort(Course.compare)
		return res
	}

	public static async getCourseSchedules(course: Course): Promise<Shift[] | null> {
		let res = await this.getRequest(`/api/courses/${course.id}/schedule?academicTerm=${this.ACADEMIC_TERM}`)
		if (res === null) {
			return null
		}
		res = res.shifts.map((d: any) => new Shift(d, course))
		return res
	}

	public static async getShortUrl(): Promise<string> {
		return this.getRequest(`/tinyurl/api-create.php?url=${window.location.href}`)
	}
}