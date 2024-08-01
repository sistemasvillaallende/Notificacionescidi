export interface ResponseDetailsTable {
  nro_emision?: number
  nro_notificacion?: number
  nro_procuracion?: number
  circunscripcion?: number
  seccion?: number
  manzana?: number
  parcela?: number
  p_h?: number
  nro_badec?: number
  nombre?: string
  estado_actual?: string
  estado_actualizado?: string
  fecha_inicio_estado?: string
  fecha_fin_estado?: string
  estado_inmueble?: string
  barrio?: string
  calle?: string
  nro?: string
  vencimiento?: string
  nro_cedulon?: number
  debe?: number
  barcode39?: string
  barcodeint25?: string
  monto_original?: number
  interes?: number
  descuento?: number
  importe_pagar?: number
  estado_Actualizado?: string
  cuit?: string
  notificado_cidi?: number
}

export interface PropsDetailTable {
  url: string
  detail?: boolean
  nroEmision?: string
  setNroEmision: Function
}

export interface Response {
  url: string
  detail?: boolean
  nroEmision?: string
  setNroEmision: Function
}

export interface ResponseInmuebleTable {
  nro_emision?: number;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  cod_estado_procuracion?: number;
  nvo_estado_procuracion?: string;
  cantidad_reg?: number;
  total?: number;
  porcentaje?: number;
}

export interface ResponseProcuracion {
  nro_Emision?: number
  nro_Procuracion?: number
  dominio?: string
  nro_Badec?: number
  nombre?: string
  cuit?: string
  estado_Actual?: string
  estado_Actualizado?: string
  notificado_cidi?: number
  fecha_Inicio_Estado?: string
  fecha_Fin_Estado?: string
  vencimiento?: string
  monto_original?: number
  interes?: number
  descuento?: number
  importe_pagar?: number
  cuit_valido?: string
}

export interface ResponseNotificaciones {
  id_notificacion?: number
  nombre?: string
  fecha_notif?: string
  Id_Oficina?: number
  Id_usuario?: number
  Modo_Notificacion?: string
  cidi_nivel?: number
  estado_notif?: string
  cuil?: string
  subject_notif?: string
  body_notif?: string
  id_oficina?: number
  desc_tipo_notif?: number | null
  estado?: string
  usuario?: string
  oficina?: string
}

export interface ResponseNuevasEmisiones {
  nro_emision?: number
  nro_proc?: number
  nro_cedulon?: number
  nro_notificacion?: number
  dominio?: string
  nro_badec?: number
  nombre?: string
  fecha_baja_real?: string
  fecha_vencimiento?: string
  monto_original?: number
  interes?: number
  descuento?: number
  importe_pagar?: number
  notificado_cidi?: number
  codigo_estado_actual?: number
  estado_actual?: string
  cuit?: number
  cuit_valido?: string
}