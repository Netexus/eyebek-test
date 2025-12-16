# Integración del Reconocimiento Facial - Próximos Pasos

## ✅ Completado

1. **Backend** - Endpoints de reconocimiento implementados
2. **Recognition App** - Refactorizada para usar Backend API
3. **Frontend** - Servicio y componente de reconocimiento creados
4. **Dashboard** - Botón de reconocimiento agregado

## ⚠️ Acción Requerida

### 1. Obtener el ID de Usuario Actual

En `dashboard_company/page.tsx`, reemplaza:
```typescript
const currentUserId = "USER_ID_PLACEHOLDER";
```

Con el ID real del usuario autenticado. Opciones:

**Opción A - Desde NextAuth session:**
```typescript
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const currentUserId = session?.user?.id;
```

**Opción B - Desde API:**
```typescript
const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  // Llamar a tu endpoint que devuelve el usuario actual
  fetchCurrentUser().then(user => setUserId(user.id));
}, []);
```

### 2. Crear Usuarios con Fotos

Para que el reconocimiento funcione, los usuarios deben tener:
- Campo `photo` con URL de imagen
- Rostro visible en la foto

### 3. Probar el Flujo Completo

```powershell
# Terminal 1 - Backend
cd Backend
dotnet run --project src\Eyebek.Api

# Terminal 2 - Recognition App  
cd EyeBek-recognition\Reconocimiento-main
npm run dev

# Terminal 3 - Frontend
cd Frontend
npm run dev
```

Luego:
1. Login en Frontend (http://localhost:3000)
2. Ir al dashboard de empresa
3. Click en "Reconocimiento Facial"
4. Serás redirigido a Recognition App
5. Permitir acceso a la cámara
6. Presentar tu rostro
7. Si coincide, serás redirigido de vuelta con éxito

### 4. Variables de Entorno

**Frontend** - Verificar que existe `.env.local` con:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Recognition App** - Crear `.env.local`:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## 🐛 Troubleshooting

Si el botón no funciona:
1. Verifica que `apiClient.ts` tenga la configuración correcta de la API
2. Verifica que el JWT token se esté enviando en las peticiones
3. Revisa la consola del navegador para errores
4. Revisa los logs del Backend

## 📋 Checklist Final

- [ ] Obtener ID de usuario real desde la sesión
- [ ] Crear usuario de prueba con foto
- [ ] Probar reconocimiento end-to-end
- [ ] Manejar casos de error (usuario sin foto, cámara no disponible, etc.)
- [ ] Agregar feedback visual al usuario después del reconocimiento
- [ ] (Opcional) Agregar animaciones/loading states

¡El sistema está listo para probarse! 🚀
