# documentador-
App para documentar procesos empresariales
## Dependencias principales

- **react** - Framework UI
- **jspdf** - Generación de PDF
- **html2canvas** - Captura de HTML para PDF

## Navegadores soportados

- Chrome/Edge (versión 90+)
- Firefox (versión 88+)
- Safari (versión 14+)

## Almacenamiento de datos

Actualmente, los datos se guardan en `localStorage` del navegador. Para una solución más robusta con base de datos en la nube, se puede integrar Supabase.

### Integración con Supabase (Opcional)

Para agregar sincronización con Supabase:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Crea una tabla `processes` con los campos necesarios
3. Instala el cliente: `npm install @supabase/supabase-js`
4. Importa y configura en `App.js`

## Solución de problemas

### Los datos no se guardan
- Verifica que localStorage esté habilitado en tu navegador
- Comprueba la consola del navegador (F12) para errores

### El PDF no se genera
- Asegúrate de tener jsPDF instalado (`npm install jspdf`)
- Verifica que todos los campos requeridos estén completos

### Errores en Vercel
- Revisa los logs en el panel de Vercel
- Verifica que las variables de entorno estén configuradas correctamente

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Soporte

¿Preguntas o problemas? Abre un issue en GitHub.

---

**Creado con ❤️ para profesionales que necesitan documentar procesos de forma ordenada y profesional.**
