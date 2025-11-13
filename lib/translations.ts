export type Language = "pt" | "en" | "es"

export const translations = {
  pt: {
    // Navegação
    vehicles: "Veículos",
    dashboard: "Dashboard",
    profile: "Perfil",
    
    // Veículos
    addVehicle: "Adicionar",
    search: "Buscar...",
    identifier: "Identificador",
    title: "Titulo",
    brand: "Marca",
    plate: "Placa",
    capacity: "Capacidade",
    createdAt: "Criado em",
    status: "Status",
    actions: "Ações",
    
    // Status
    active: "Ativo",
    inactive: "Inativo",
    
    // Filtros
    filterByCapacity: "Filtrar por capacidade",
    filterByStatus: "Filtrar por status",
    
    // Global
    selectLanguage: "Selecionar idioma",
    toggleTheme: "Alternar tema",
    
    // Navigation
    main: "Principal",
    expandMenu: "Expandir menu",
    collapseMenu: "Recolher menu",
  },
  en: {
    // Navigation
    vehicles: "Vehicles",
    dashboard: "Dashboard",
    profile: "Profile",
    
    // Vehicles
    addVehicle: "Add",
    search: "Search...",
    identifier: "Identifier",
    title: "Title",
    brand: "Brand",
    plate: "Plate",
    capacity: "Capacity",
    createdAt: "Created at",
    status: "Status",
    actions: "Actions",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    
    // Filters
    filterByCapacity: "Filter by capacity",
    filterByStatus: "Filter by status",
    
    // Global
    selectLanguage: "Select language",
    toggleTheme: "Toggle theme",
    
    // Navigation
    main: "Main",
    expandMenu: "Expand menu",
    collapseMenu: "Collapse menu",
  },
  es: {
    // Navegación
    vehicles: "Vehículos",
    dashboard: "Panel",
    profile: "Perfil",
    
    // Vehículos
    addVehicle: "Agregar",
    search: "Buscar...",
    identifier: "Identificador",
    title: "Título",
    brand: "Marca",
    plate: "Placa",
    capacity: "Capacidad",
    createdAt: "Creado en",
    status: "Estado",
    actions: "Acciones",
    
    // Estado
    active: "Activo",
    inactive: "Inactivo",
    
    // Filtros
    filterByCapacity: "Filtrar por capacidad",
    filterByStatus: "Filtrar por estado",
    
    // Global
    selectLanguage: "Seleccionar idioma",
    toggleTheme: "Alternar tema",
    
    // Navigation
    main: "Principal",
    expandMenu: "Expandir menú",
    collapseMenu: "Contraer menú",
  },
} as const

export function getTranslation(language: Language, key: keyof typeof translations.pt): string {
  return translations[language][key] || translations.pt[key]
}

export function useTranslations(language: Language) {
  return (key: keyof typeof translations.pt) => getTranslation(language, key)
}

