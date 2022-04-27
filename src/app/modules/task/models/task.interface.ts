import {Links} from "../../../shared/interfaces/shared.interface";
import {Door} from "../../customer/doors/interfaces/door.interface";

export interface ModelTask {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Task[];
}

export interface Task {
  id?: number;
  folio?: string;
  title?: string;
  color?: string;
  job_center_id: number;
  job_center_name?: string
  customer_id: number;
  customer_name?: string
  employee_id: number;
  employee_name?: string;
  work_type_id: number;
  work_type_name?: string
  initial_date?: string;
  final_date?: string;
  initial_hour: string;
  final_hour: string;
  start_task_hour?: string | null;
  end_task_hour?: string | null;
  status?: string;
  invoiced: number
  created_at?: string;
  updated_at?: string;
  comments: null | string;
  dates?: [];
  doors: Door[] | [];
}

export interface EmailSend {
  task_id: number,
  door_id: number,
  email: string
}

export interface DoorByTask {
  id?: number
  name: string
  brand?: string
  customer_id: number
  door_type_id: number
  door_type_name: string
  folio:string
  is_active: number
  model?: string
  observations?: string
  photo?: string
  photos?: any
  report_pdf: string
  created_at?: string
  updated_at?: string
}

export interface PhotoByDoor {
  id?: number,
  task_id?: number,
  door_id?: number,
  photo?: string,
  section?: string,
  created_at?: string
  updated_at?: string
}

export interface TaskDetail {
  data: Task
}

export interface CalendarDate {
  initial_date: string | undefined;
  final_date: string | undefined;
  initial_hour: string;
  final_hour: string;
}

export interface Event {
  id: string,
  title: string,
  start: string,
  end: string
}

// DataSource Work Types
export interface ModelWorkType {
  total: number;
  next: null;
  previous: null;
  data: WorkType[];
}

export interface WorkType {
  id?: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface MessageEdit {
  id?:    number;
  title:     string;
}

export interface reportTask {
  customer?: string | number
  employee?: string | number
  group?: string | number
  job_center?: string | number
  status?: string | number
  work_type?: string |number
  initial_date?: string
  final_date?: string,
  type?: string;
}

export interface MetaModel {
  total: number
}

export interface CalendarForm {
  initial_date?: string,
  final_date?: string,
  customer?: string,
  employee?: string,
  job_center?: string,
  work_type?: string,
  status?: string,
  door_id?: string
}
