
export interface ModelLifting {
  data:  Lifting[];
  links: Links;
  meta:  Meta;
}

export interface Lifting {
  id?:                     number;
  folio?:                  string;
  job_center_id:          number;
  customer_id:            number;
  employee_id:            number;
  work_type_id:           number;
  date?:                   string;
  place?:                  string;
  series?:                 null;
  color?:                  null;
  lock_type?:              null;
  type_of_handle?:         null;
  folding?:                number;
  sliding?:                number;
  air_system?:             number;
  smooth_stave?:           number;
  louver?:                 number;
  others?:                 null;
  acrylic?:                number;
  annealing?:              number;
  tempered?:               number;
  laminate?:               null;
  duovent?:                null;
  glass_color?:            null;
  thickness?:              null;
  polished_edge?:          number;
  bowling_song?:           number;
  dead_edge?:              number;
  hole_diameter?:          null;
  hangovers?:              number;
  hardware_type?:          null;
  hinge_type?:             null;
  top_hardware?:           number;
  bottom_hardware?:        number;
  bracket_hardware?:       number;
  rib_holder?:             number;
  turning_point?:          number;
  type_of_handle_measure?: null;
  others_two?:             null;
  type_of_zoclo?:          null;
  type_of_fittings?:       null;
  perimeter_frame?:        null;
  back_frame?:             null;
  attached_to_the_wall?:   number;
  glued_to_frame?:         number;
  wide?:                   null;
  high?:                   null;
  quotation?:              number;
  manufacturing?:          number;
  working_hours?:          null;
  work_at_height?:         null;
  work_description?:       string;
  photo_one?:              null;
  photo_two?:              null;
  photo_three?:            null;
  status?:                 string;
}

export interface Links {
  first: string;
  last:  string;
  prev:  null;
  next:  null;
}

export interface Meta {
  current_page: number;
  from:         number;
  last_page:    number;
  links:        Link[];
  path:         string;
  per_page:     number;
  to:           number;
  total:        number;
}

export interface Link {
  url:    null | string;
  label:  string;
  active: boolean;
}

// Data Paginate
export interface LiftingPaginate {
  page: string,
  page_size: string
}

export interface liftingDetail {
  data: Lifting
}
