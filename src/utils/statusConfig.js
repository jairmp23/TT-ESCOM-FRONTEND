export const STATUS_CONFIG = {
  scheduled: { label: "Agendada",       colorClass: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmada",     colorClass: "bg-blue-100   text-blue-800"   },
  completed: { label: "Completada",     colorClass: "bg-green-100  text-green-800"  },
  cancelled: { label: "Cancelada",      colorClass: "bg-red-100    text-red-800"    },
  no_show:   { label: "No se presentó", colorClass: "bg-gray-100   text-gray-600"   },
};

/** Estilos para tarjetas con borde lateral (ej: celdas del calendario). */
export const STATUS_CARD_STYLES = {
  scheduled: { card: "bg-yellow-100 border-l-4 border-yellow-500",          text: "text-yellow-900", subtext: "text-yellow-700" },
  confirmed: { card: "bg-blue-100   border-l-4 border-blue-600",            text: "text-blue-900",   subtext: "text-blue-700"   },
  completed: { card: "bg-green-100  border-l-4 border-green-600",           text: "text-green-900",  subtext: "text-green-700"  },
  cancelled: { card: "bg-red-100    border-l-4 border-red-400 opacity-60",  text: "text-red-700",    subtext: "text-red-500"    },
  no_show:   { card: "bg-gray-100   border-l-4 border-gray-400 opacity-60", text: "text-gray-600",   subtext: "text-gray-500"   },
};

export const STATUS_CARD_FALLBACK = { card: "bg-gray-100", text: "text-gray-700", subtext: "text-gray-500" };
