export interface Task {
	id: string;
	title: string;
	body: string;
	done: boolean;
	image_path: string;
	created_at: string;
}

export interface TaskPage {
	records: Task[];
	totals: number;
	page: number;
	per_page: number;
}

export interface TaskCreate {
	title: string;
	body: string;
	image_path?: string;
}