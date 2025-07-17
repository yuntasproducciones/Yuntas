// Utilidad para verificar permisos del usuario de forma consistente
export interface UserPermissions {
  hasValidRole: boolean;
  hasCreateProductsPermission: boolean;
  hasEditProductsPermission: boolean;
  hasDeleteProductsPermission: boolean;
  canManageProducts: boolean;
}

export const checkUserPermissions = async (token: string): Promise<UserPermissions> => {
  try {
    const response = await fetch('/api/v1/user', {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('No se pudo obtener información del usuario');
    }
    
    const userInfo = await response.json();
    const userData = userInfo.data || userInfo;
    const roles = userData.roles || userData.role || [];
    const permissions = userData.permissions || [];
    
    // Verificar roles (usar nombres en minúsculas para consistencia)
    const hasValidRole = Array.isArray(roles) 
      ? roles.some(role => ['admin', 'user'].includes((role.name || role).toLowerCase()))
      : ['admin', 'user'].includes((roles.name || roles || '').toLowerCase());
    
    // Verificar permisos específicos (usar nombres exactos del backend)
    const hasCreateProductsPermission = Array.isArray(permissions)
      ? permissions.some(perm => (perm.name || perm) === 'crear-productos')
      : (permissions.name || permissions) === 'crear-productos';
      
    const hasEditProductsPermission = Array.isArray(permissions)
      ? permissions.some(perm => (perm.name || perm) === 'editar-productos')
      : (permissions.name || permissions) === 'editar-productos';
      
    const hasDeleteProductsPermission = Array.isArray(permissions)
      ? permissions.some(perm => (perm.name || perm) === 'eliminar-productos')
      : (permissions.name || permissions) === 'eliminar-productos';
    
    return {
      hasValidRole,
      hasCreateProductsPermission,
      hasEditProductsPermission,
      hasDeleteProductsPermission,
      canManageProducts: hasValidRole && hasCreateProductsPermission
    };
    
  } catch (error) {
    console.error('Error verificando permisos:', error);
    return {
      hasValidRole: false,
      hasCreateProductsPermission: false,
      hasEditProductsPermission: false,
      hasDeleteProductsPermission: false,
      canManageProducts: false
    };
  }
};
