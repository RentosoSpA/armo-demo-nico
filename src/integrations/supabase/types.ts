export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agency_settings: {
        Row: {
          agency_name: string
          color_hex: string | null
          created_at: string
          empresa_id: string
          id: string
          logo_url: string | null
          sitio_web: string | null
          updated_at: string
        }
        Insert: {
          agency_name?: string
          color_hex?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          logo_url?: string | null
          sitio_web?: string | null
          updated_at?: string
        }
        Update: {
          agency_name?: string
          color_hex?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          logo_url?: string | null
          sitio_web?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_settings_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      agente: {
        Row: {
          activo: boolean
          codigo_telefonico: number
          created_at: string
          domingo_fin: number | null
          domingo_inicio: number | null
          email: string
          empresa_id: string
          id: string
          jueves_fin: number | null
          jueves_inicio: number | null
          lunes_fin: number | null
          lunes_inicio: number | null
          martes_fin: number | null
          martes_inicio: number | null
          miercoles_fin: number | null
          miercoles_inicio: number | null
          nombre: string
          sabado_fin: number | null
          sabado_inicio: number | null
          telefono: number
          time_zone: string
          updated_at: string
          user_uid: string
          viernes_fin: number | null
          viernes_inicio: number | null
        }
        Insert: {
          activo?: boolean
          codigo_telefonico: number
          created_at?: string
          domingo_fin?: number | null
          domingo_inicio?: number | null
          email: string
          empresa_id: string
          id?: string
          jueves_fin?: number | null
          jueves_inicio?: number | null
          lunes_fin?: number | null
          lunes_inicio?: number | null
          martes_fin?: number | null
          martes_inicio?: number | null
          miercoles_fin?: number | null
          miercoles_inicio?: number | null
          nombre: string
          sabado_fin?: number | null
          sabado_inicio?: number | null
          telefono: number
          time_zone?: string
          updated_at?: string
          user_uid: string
          viernes_fin?: number | null
          viernes_inicio?: number | null
        }
        Update: {
          activo?: boolean
          codigo_telefonico?: number
          created_at?: string
          domingo_fin?: number | null
          domingo_inicio?: number | null
          email?: string
          empresa_id?: string
          id?: string
          jueves_fin?: number | null
          jueves_inicio?: number | null
          lunes_fin?: number | null
          lunes_inicio?: number | null
          martes_fin?: number | null
          martes_inicio?: number | null
          miercoles_fin?: number | null
          miercoles_inicio?: number | null
          nombre?: string
          sabado_fin?: number | null
          sabado_inicio?: number | null
          telefono?: number
          time_zone?: string
          updated_at?: string
          user_uid?: string
          viernes_fin?: number | null
          viernes_inicio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agente_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      amenidades: {
        Row: {
          amoblado: boolean
          balcon: boolean
          cctv: boolean
          cocina: boolean
          conserjeria: boolean
          estacionamiento: boolean
          garage: boolean
          gimnasio: boolean
          id: string
          jardin: boolean
          lavadora: boolean
          lavaplatos: boolean
          mascota: boolean
          piscina: boolean
          propiedad_id: string
          quincho: boolean
          tv_cable: boolean
          wifi: boolean
          zona_fumador: boolean
        }
        Insert: {
          amoblado?: boolean
          balcon?: boolean
          cctv?: boolean
          cocina?: boolean
          conserjeria?: boolean
          estacionamiento?: boolean
          garage?: boolean
          gimnasio?: boolean
          id?: string
          jardin?: boolean
          lavadora?: boolean
          lavaplatos?: boolean
          mascota?: boolean
          piscina?: boolean
          propiedad_id: string
          quincho?: boolean
          tv_cable?: boolean
          wifi?: boolean
          zona_fumador?: boolean
        }
        Update: {
          amoblado?: boolean
          balcon?: boolean
          cctv?: boolean
          cocina?: boolean
          conserjeria?: boolean
          estacionamiento?: boolean
          garage?: boolean
          gimnasio?: boolean
          id?: string
          jardin?: boolean
          lavadora?: boolean
          lavaplatos?: boolean
          mascota?: boolean
          piscina?: boolean
          propiedad_id?: string
          quincho?: boolean
          tv_cable?: boolean
          wifi?: boolean
          zona_fumador?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "amenidades_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: true
            referencedRelation: "propiedad"
            referencedColumns: ["id"]
          },
        ]
      }
      email_rate_limits: {
        Row: {
          email_count: number | null
          empresa_id: string
          id: string
          user_id: string
          window_start: string
        }
        Insert: {
          email_count?: number | null
          empresa_id: string
          id?: string
          user_id: string
          window_start?: string
        }
        Update: {
          email_count?: number | null
          empresa_id?: string
          id?: string
          user_id?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_rate_limits_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa: {
        Row: {
          codigo_telefonico: number
          created_at: string
          direccion: string
          email: string
          id: string
          mision: string | null
          nit: string
          nombre: string
          sobre_nosotros: string | null
          telefono: number
          updated_at: string
          vision: string | null
        }
        Insert: {
          codigo_telefonico: number
          created_at?: string
          direccion: string
          email: string
          id?: string
          mision?: string | null
          nit: string
          nombre: string
          sobre_nosotros?: string | null
          telefono: number
          updated_at?: string
          vision?: string | null
        }
        Update: {
          codigo_telefonico?: number
          created_at?: string
          direccion?: string
          email?: string
          id?: string
          mision?: string | null
          nit?: string
          nombre?: string
          sobre_nosotros?: string | null
          telefono?: number
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      google_calendar_tokens: {
        Row: {
          access_token: string
          agente_id: string
          calendar_id: string | null
          created_at: string
          id: string
          refresh_token: string | null
          token_expiry: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          agente_id: string
          calendar_id?: string | null
          created_at?: string
          id?: string
          refresh_token?: string | null
          token_expiry: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          agente_id?: string
          calendar_id?: string | null
          created_at?: string
          id?: string
          refresh_token?: string | null
          token_expiry?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invitation_links: {
        Row: {
          created_at: string | null
          created_by: string
          current_uses: number | null
          empresa_id: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          metadata: Json | null
          role: Database["public"]["Enums"]["app_role"]
          token: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          current_uses?: number | null
          empresa_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          role: Database["public"]["Enums"]["app_role"]
          token: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          current_uses?: number | null
          empresa_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_links_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidad_documentos: {
        Row: {
          created_at: string
          descripcion: string | null
          estado: string
          feedback: string | null
          hallazgos: Json | null
          id: string
          metadata: Json | null
          mime: string | null
          nombre_archivo: string | null
          oportunidad_id: string
          score_doc: number | null
          sha256: string | null
          tipo_documento: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          estado?: string
          feedback?: string | null
          hallazgos?: Json | null
          id?: string
          metadata?: Json | null
          mime?: string | null
          nombre_archivo?: string | null
          oportunidad_id: string
          score_doc?: number | null
          sha256?: string | null
          tipo_documento: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          estado?: string
          feedback?: string | null
          hallazgos?: Json | null
          id?: string
          metadata?: Json | null
          mime?: string | null
          nombre_archivo?: string | null
          oportunidad_id?: string
          score_doc?: number | null
          sha256?: string | null
          tipo_documento?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidad_documentos_oportunidad_id_fkey"
            columns: ["oportunidad_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          agente_id: string
          channel: string | null
          created_at: string
          decision_total: string | null
          empresa_id: string
          etapa: string
          external_id: string | null
          fecha_cierre: string | null
          fecha_inicio: string | null
          id: string
          motivo_cierre: string | null
          observaciones: string | null
          precio_interes: number | null
          propiedad_id: string
          prospecto_id: string
          score_docs: number | null
          score_ingresos: number | null
          score_total: number | null
          source: string
          status: string
          topk_rank: number | null
          updated_at: string
        }
        Insert: {
          agente_id: string
          channel?: string | null
          created_at?: string
          decision_total?: string | null
          empresa_id: string
          etapa?: string
          external_id?: string | null
          fecha_cierre?: string | null
          fecha_inicio?: string | null
          id?: string
          motivo_cierre?: string | null
          observaciones?: string | null
          precio_interes?: number | null
          propiedad_id: string
          prospecto_id: string
          score_docs?: number | null
          score_ingresos?: number | null
          score_total?: number | null
          source?: string
          status?: string
          topk_rank?: number | null
          updated_at?: string
        }
        Update: {
          agente_id?: string
          channel?: string | null
          created_at?: string
          decision_total?: string | null
          empresa_id?: string
          etapa?: string
          external_id?: string | null
          fecha_cierre?: string | null
          fecha_inicio?: string | null
          id?: string
          motivo_cierre?: string | null
          observaciones?: string | null
          precio_interes?: number | null
          propiedad_id?: string
          prospecto_id?: string
          score_docs?: number | null
          score_ingresos?: number | null
          score_total?: number | null
          source?: string
          status?: string
          topk_rank?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_oportunidades_agente"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_oportunidades_propiedad"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_oportunidades_prospecto"
            columns: ["prospecto_id"]
            isOneToOne: false
            referencedRelation: "prospecto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          empresa_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          empresa_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          empresa_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      propiedad: {
        Row: {
          anio_construccion: number | null
          area_total: number
          area_usable: number | null
          arriendo: boolean
          banos: number
          comuna: string
          created_at: string
          descripcion: string | null
          direccion: string
          disponibilidad_desde: string | null
          divisa: Database["public"]["Enums"]["divisa"] | null
          documentos_requeridos: string[] | null
          embedding: string | null
          embedding_version: number | null
          empresa_id: string
          estado: Database["public"]["Enums"]["estado_propiedad"]
          fecha_construccion: string | null
          gastos_comunes: number | null
          habitaciones: number
          id: string
          lat: number | null
          lng: number | null
          num_bodegas: number | null
          num_estacionamientos: number | null
          permite_mascotas: boolean | null
          piso: number | null
          precio_arriendo: number | null
          precio_venta: number | null
          propietario_id: string
          region: string
          tipo: Database["public"]["Enums"]["tipo_propiedad"]
          titulo: string
          ubicacion_general: boolean
          updated_at: string
          url_video: string | null
          venta: boolean
          visible: boolean
        }
        Insert: {
          anio_construccion?: number | null
          area_total: number
          area_usable?: number | null
          arriendo: boolean
          banos: number
          comuna: string
          created_at?: string
          descripcion?: string | null
          direccion: string
          disponibilidad_desde?: string | null
          divisa?: Database["public"]["Enums"]["divisa"] | null
          documentos_requeridos?: string[] | null
          embedding?: string | null
          embedding_version?: number | null
          empresa_id: string
          estado: Database["public"]["Enums"]["estado_propiedad"]
          fecha_construccion?: string | null
          gastos_comunes?: number | null
          habitaciones: number
          id?: string
          lat?: number | null
          lng?: number | null
          num_bodegas?: number | null
          num_estacionamientos?: number | null
          permite_mascotas?: boolean | null
          piso?: number | null
          precio_arriendo?: number | null
          precio_venta?: number | null
          propietario_id: string
          region: string
          tipo: Database["public"]["Enums"]["tipo_propiedad"]
          titulo: string
          ubicacion_general?: boolean
          updated_at?: string
          url_video?: string | null
          venta: boolean
          visible?: boolean
        }
        Update: {
          anio_construccion?: number | null
          area_total?: number
          area_usable?: number | null
          arriendo?: boolean
          banos?: number
          comuna?: string
          created_at?: string
          descripcion?: string | null
          direccion?: string
          disponibilidad_desde?: string | null
          divisa?: Database["public"]["Enums"]["divisa"] | null
          documentos_requeridos?: string[] | null
          embedding?: string | null
          embedding_version?: number | null
          empresa_id?: string
          estado?: Database["public"]["Enums"]["estado_propiedad"]
          fecha_construccion?: string | null
          gastos_comunes?: number | null
          habitaciones?: number
          id?: string
          lat?: number | null
          lng?: number | null
          num_bodegas?: number | null
          num_estacionamientos?: number | null
          permite_mascotas?: boolean | null
          piso?: number | null
          precio_arriendo?: number | null
          precio_venta?: number | null
          propietario_id?: string
          region?: string
          tipo?: Database["public"]["Enums"]["tipo_propiedad"]
          titulo?: string
          ubicacion_general?: boolean
          updated_at?: string
          url_video?: string | null
          venta?: boolean
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "propiedad_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propiedad_propietario_id_fkey"
            columns: ["propietario_id"]
            isOneToOne: false
            referencedRelation: "propietario"
            referencedColumns: ["id"]
          },
        ]
      }
      propiedad_agente: {
        Row: {
          agente_id: string
          assigned_at: string
          propiedad_id: string
          rol: string
        }
        Insert: {
          agente_id: string
          assigned_at?: string
          propiedad_id: string
          rol?: string
        }
        Update: {
          agente_id?: string
          assigned_at?: string
          propiedad_id?: string
          rol?: string
        }
        Relationships: [
          {
            foreignKeyName: "propiedad_agente_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propiedad_agente_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedad"
            referencedColumns: ["id"]
          },
        ]
      }
      propiedad_documentos: {
        Row: {
          created_at: string
          descripcion: string | null
          fecha_vencimiento: string | null
          id: string
          nombre_archivo: string
          propiedad_id: string
          tipo_documento: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          fecha_vencimiento?: string | null
          id?: string
          nombre_archivo: string
          propiedad_id: string
          tipo_documento: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          fecha_vencimiento?: string | null
          id?: string
          nombre_archivo?: string
          propiedad_id?: string
          tipo_documento?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "propiedad_documentos_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedad"
            referencedColumns: ["id"]
          },
        ]
      }
      propiedad_imagenes: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre_archivo: string
          orden: number | null
          propiedad_id: string
          tipo_imagen: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre_archivo: string
          orden?: number | null
          propiedad_id: string
          tipo_imagen?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre_archivo?: string
          orden?: number | null
          propiedad_id?: string
          tipo_imagen?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "propiedad_imagenes_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedad"
            referencedColumns: ["id"]
          },
        ]
      }
      propietario: {
        Row: {
          codigo_telefonico: number
          created_at: string
          documento: string
          email: string
          empresa_id: string
          id: string
          nombre: string
          telefono: number
          tipo_documento: Database["public"]["Enums"]["tipo_documento"]
          updated_at: string
        }
        Insert: {
          codigo_telefonico: number
          created_at?: string
          documento: string
          email: string
          empresa_id: string
          id?: string
          nombre: string
          telefono: number
          tipo_documento: Database["public"]["Enums"]["tipo_documento"]
          updated_at?: string
        }
        Update: {
          codigo_telefonico?: number
          created_at?: string
          documento?: string
          email?: string
          empresa_id?: string
          id?: string
          nombre?: string
          telefono?: number
          tipo_documento?: Database["public"]["Enums"]["tipo_documento"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "propietario_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      prospecto: {
        Row: {
          aprobado: boolean | null
          codigo_telefonico: number | null
          display_name: string | null
          documento: string | null
          egresos_mensuales: number | null
          email: string | null
          estado: string | null
          evaluado: boolean | null
          fb_uid: string | null
          fecha_nacimiento: string | null
          first_seen_at: string
          genero: string | null
          id: string
          ingresos_mensuales: number | null
          last_seen_at: string
          phone_e164: string
          primer_apellido: string | null
          primer_nombre: string | null
          segundo_apellido: string | null
          segundo_nombre: string | null
          situacion_laboral: string | null
          source: string
          tipo_documento: string | null
          wa_id: string | null
        }
        Insert: {
          aprobado?: boolean | null
          codigo_telefonico?: number | null
          display_name?: string | null
          documento?: string | null
          egresos_mensuales?: number | null
          email?: string | null
          estado?: string | null
          evaluado?: boolean | null
          fb_uid?: string | null
          fecha_nacimiento?: string | null
          first_seen_at?: string
          genero?: string | null
          id?: string
          ingresos_mensuales?: number | null
          last_seen_at?: string
          phone_e164: string
          primer_apellido?: string | null
          primer_nombre?: string | null
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          situacion_laboral?: string | null
          source: string
          tipo_documento?: string | null
          wa_id?: string | null
        }
        Update: {
          aprobado?: boolean | null
          codigo_telefonico?: number | null
          display_name?: string | null
          documento?: string | null
          egresos_mensuales?: number | null
          email?: string | null
          estado?: string | null
          evaluado?: boolean | null
          fb_uid?: string | null
          fecha_nacimiento?: string | null
          first_seen_at?: string
          genero?: string | null
          id?: string
          ingresos_mensuales?: number | null
          last_seen_at?: string
          phone_e164?: string
          primer_apellido?: string | null
          primer_nombre?: string | null
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          situacion_laboral?: string | null
          source?: string
          tipo_documento?: string | null
          wa_id?: string | null
        }
        Relationships: []
      }
      reporte_mensual: {
        Row: {
          agente_id: string | null
          empresa_id: string
          enviado: boolean
          enviado_en: string | null
          generado_en: string
          id: string
          payload: Json
          periodo: string
        }
        Insert: {
          agente_id?: string | null
          empresa_id: string
          enviado?: boolean
          enviado_en?: string | null
          generado_en?: string
          id?: string
          payload: Json
          periodo: string
        }
        Update: {
          agente_id?: string | null
          empresa_id?: string
          enviado?: boolean
          enviado_en?: string | null
          generado_en?: string
          id?: string
          payload?: Json
          periodo?: string
        }
        Relationships: [
          {
            foreignKeyName: "reporte_mensual_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reporte_mensual_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          empresa_id: string
          expires_at: string
          id: string
          invited_by: string
          metadata: Json | null
          role: Database["public"]["Enums"]["app_role"]
          sent_at: string | null
          status: string | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          empresa_id: string
          expires_at?: string
          id?: string
          invited_by: string
          metadata?: Json | null
          role: Database["public"]["Enums"]["app_role"]
          sent_at?: string | null
          status?: string | null
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          empresa_id?: string
          expires_at?: string
          id?: string
          invited_by?: string
          metadata?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          sent_at?: string | null
          status?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      visitas: {
        Row: {
          agente_id: string
          calendar_event_id: string | null
          calendar_sync_error: string | null
          calendar_synced: boolean | null
          calendar_synced_at: string | null
          calificacion: number | null
          created_at: string
          estado: string
          fecha_fin: string
          fecha_inicio: string
          feedback: string | null
          id: string
          motivo_cancelacion: string | null
          observaciones: string | null
          oportunidad_id: string
          propiedad_id: string
          prospecto_id: string
          resultado: string | null
          tipo_visita: string
          updated_at: string
        }
        Insert: {
          agente_id: string
          calendar_event_id?: string | null
          calendar_sync_error?: string | null
          calendar_synced?: boolean | null
          calendar_synced_at?: string | null
          calificacion?: number | null
          created_at?: string
          estado?: string
          fecha_fin: string
          fecha_inicio: string
          feedback?: string | null
          id?: string
          motivo_cancelacion?: string | null
          observaciones?: string | null
          oportunidad_id: string
          propiedad_id: string
          prospecto_id: string
          resultado?: string | null
          tipo_visita?: string
          updated_at?: string
        }
        Update: {
          agente_id?: string
          calendar_event_id?: string | null
          calendar_sync_error?: string | null
          calendar_synced?: boolean | null
          calendar_synced_at?: string | null
          calificacion?: number | null
          created_at?: string
          estado?: string
          fecha_fin?: string
          fecha_inicio?: string
          feedback?: string | null
          id?: string
          motivo_cancelacion?: string | null
          observaciones?: string | null
          oportunidad_id?: string
          propiedad_id?: string
          prospecto_id?: string
          resultado?: string | null
          tipo_visita?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_visitas_agente"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_visitas_oportunidad"
            columns: ["oportunidad_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_visitas_propiedad"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_visitas_prospecto"
            columns: ["prospecto_id"]
            isOneToOne: false
            referencedRelation: "prospecto"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      check_and_increment_rate_limit: {
        Args: {
          _empresa_id: string
          _max_emails?: number
          _user_id: string
          _window_hours?: number
        }
        Returns: boolean
      }
      expire_old_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_enum_values: {
        Args: { enum_name: string }
        Returns: string[]
      }
      get_user_empresa_id: {
        Args: { _user_id: string }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_link_usage: {
        Args: { link_id: string }
        Returns: undefined
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      propiedad_semantic_search: {
        Args: { query_embedding: string; top_k: number }
        Returns: {
          anio_construccion: number | null
          area_total: number
          area_usable: number | null
          arriendo: boolean
          banos: number
          comuna: string
          created_at: string
          descripcion: string | null
          direccion: string
          disponibilidad_desde: string | null
          divisa: Database["public"]["Enums"]["divisa"] | null
          documentos_requeridos: string[] | null
          embedding: string | null
          embedding_version: number | null
          empresa_id: string
          estado: Database["public"]["Enums"]["estado_propiedad"]
          fecha_construccion: string | null
          gastos_comunes: number | null
          habitaciones: number
          id: string
          lat: number | null
          lng: number | null
          num_bodegas: number | null
          num_estacionamientos: number | null
          permite_mascotas: boolean | null
          piso: number | null
          precio_arriendo: number | null
          precio_venta: number | null
          propietario_id: string
          region: string
          tipo: Database["public"]["Enums"]["tipo_propiedad"]
          titulo: string
          ubicacion_general: boolean
          updated_at: string
          url_video: string | null
          venta: boolean
          visible: boolean
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "agent" | "supervisor" | "assistant"
      canal: "WHATSAPP" | "WEB" | "EMAIL"
      divisa: "UF" | "CLP"
      documento_tipo:
        | "Identidad"
        | "ComprobantesIngresos"
        | "CertificadoLaboral"
        | "ReferenciasBancarias"
        | "CartaRecomendacion"
        | "Otro"
      empleo_estado: "Empleado" | "Independiente" | "Empresa" | "Otro"
      estado_contrato: "Draft" | "Sent" | "Signed" | "Declined" | "Canceled"
      estado_documento: "Uploaded" | "Verified" | "Rejected"
      estado_lead: "Open" | "Closed"
      estado_pago: "Pending" | "Succeeded" | "Failed" | "Canceled" | "Refunded"
      estado_propiedad: "Disponible" | "Reservada" | "Arrendada" | "Vendida"
      estado_visita: "Agendada" | "Aprobada" | "Completada" | "Cancelada"
      etapa_oportunidad:
        | "Exploracion"
        | "Evaluacion"
        | "Visita"
        | "Negociacion"
        | "Cierre"
        | "Perdida"
      evaluacion_estado:
        | "Pending"
        | "Prequalified"
        | "PrequalifiedSoft"
        | "Disqualified"
        | "PendingId"
      proveedor_firma: "FEDOC"
      proveedor_pago: "MERCADOPAGO" | "TRANSBANK" | "STRIPE" | "FLOW" | "OTRO"
      session_state:
        | "DISCOVERY"
        | "INFO_COLLECTION"
        | "DOC_CHECKLIST"
        | "DOC_UPLOADING"
        | "SCORING_LITE"
        | "SLOTS_FETCHING"
        | "SLOTS_PRESENTED"
        | "SLOT_SELECTED"
        | "VISIT_CREATED"
        | "DEAD"
      tipo_documento: "RUT" | "DNI" | "PASAPORTE" | "CEDULA"
      tipo_propiedad:
        | "Casa"
        | "Departamento"
        | "Parcela"
        | "LocalComercial"
        | "Oficina"
        | "Loft"
        | "Duplex"
        | "Terreno"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "agent", "supervisor", "assistant"],
      canal: ["WHATSAPP", "WEB", "EMAIL"],
      divisa: ["UF", "CLP"],
      documento_tipo: [
        "Identidad",
        "ComprobantesIngresos",
        "CertificadoLaboral",
        "ReferenciasBancarias",
        "CartaRecomendacion",
        "Otro",
      ],
      empleo_estado: ["Empleado", "Independiente", "Empresa", "Otro"],
      estado_contrato: ["Draft", "Sent", "Signed", "Declined", "Canceled"],
      estado_documento: ["Uploaded", "Verified", "Rejected"],
      estado_lead: ["Open", "Closed"],
      estado_pago: ["Pending", "Succeeded", "Failed", "Canceled", "Refunded"],
      estado_propiedad: ["Disponible", "Reservada", "Arrendada", "Vendida"],
      estado_visita: ["Agendada", "Aprobada", "Completada", "Cancelada"],
      etapa_oportunidad: [
        "Exploracion",
        "Evaluacion",
        "Visita",
        "Negociacion",
        "Cierre",
        "Perdida",
      ],
      evaluacion_estado: [
        "Pending",
        "Prequalified",
        "PrequalifiedSoft",
        "Disqualified",
        "PendingId",
      ],
      proveedor_firma: ["FEDOC"],
      proveedor_pago: ["MERCADOPAGO", "TRANSBANK", "STRIPE", "FLOW", "OTRO"],
      session_state: [
        "DISCOVERY",
        "INFO_COLLECTION",
        "DOC_CHECKLIST",
        "DOC_UPLOADING",
        "SCORING_LITE",
        "SLOTS_FETCHING",
        "SLOTS_PRESENTED",
        "SLOT_SELECTED",
        "VISIT_CREATED",
        "DEAD",
      ],
      tipo_documento: ["RUT", "DNI", "PASAPORTE", "CEDULA"],
      tipo_propiedad: [
        "Casa",
        "Departamento",
        "Parcela",
        "LocalComercial",
        "Oficina",
        "Loft",
        "Duplex",
        "Terreno",
      ],
    },
  },
} as const
