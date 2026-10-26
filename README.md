# Proyecto App: control de tarjetas de crédito

App móvil para llevar las tarjetas de crédito en un solo lugar: registras tus tarjetas con su cupo y día de vencimiento, anotas las compras en cuotas y la app te va diciendo cuánto te toca pagar este mes, cuánto cupo te queda y si estás atrasado.

Está hecha con Expo (React Native) para Android, iOS y web.

## Qué se puede hacer

- Agregar tarjetas de Banco Estado, CMR Falabella, Santander, Visa o MasterCard. Visa y MasterCard piden un alias para saber cuál es cuál.
- Ver todas las tarjetas con el cupo disponible y el % usado.
- Registrar compras en una o varias cuotas. Si la compra se pasa del cupo, no se guarda.
- Ver el detalle de cada tarjeta: cuánto se paga este mes, cuándo vence y en qué cuota va cada compra.
- Marcar el mes como pagado: todas las compras avanzan una cuota y las que terminan se borran, liberando cupo.

## Cómo correrla

Se necesita Node.js 20 o más nuevo y la app Expo Go en el celular si se quiere probar ahí.

```bash
npm install
npx expo start
```

Después escaneas el QR con Expo Go, o apretas `a` para Android, `i` para iOS o `w` para abrirla en el navegador.

Otros comandos:

```bash
npm run android   # abre directo en Android
npm run ios       # abre directo en iOS
npm run web       # abre en el navegador
npm run lint      # revisa el código con ESLint
npx tsc --noEmit  # revisa los tipos de TypeScript
```

## Tecnologías

- Expo SDK 54 con React Native 0.81 y React 19
- expo-router para la navegación (cada archivo en `app/` es una pantalla)
- NativeWind 4 + Tailwind 3 para los estilos (se escribe `className` como en web)
- TypeScript
- Fuente Inter desde `@expo-google-fonts/inter`

## Cómo está organizado

```
app/                       pantallas (expo-router)
  _layout.tsx              carga fuentes, providers y el Stack de pantallas
  index.tsx                inicio
  Tarjetas.tsx             lista de tarjetas
  RegistrarTarjeta.tsx     formulario de tarjeta nueva
  RegistrarTransaccion.tsx formulario de compra
  detalle-tarjeta/[id].tsx detalle de una tarjeta
components/
  MenuNavegacion.tsx       menú de abajo
  TarjetaGrande.tsx        tarjeta grande (vista previa y detalle)
  TarjetaMini.tsx          tarjeta chica de la lista
context/
  AppContext.tsx           estado global y todos los cálculos
constants/
  banks.ts                 bancos disponibles y sus colores
tailwind.config.js         colores y fuentes propios
```

## Cómo funciona por dentro

Todo el estado está en `context/AppContext.tsx` y las pantallas lo leen con `useApp()`.

Se guardan solo dos cosas: las tarjetas (lo que escribe el usuario) y las compras. Todo lo demás se calcula cada vez que se dibuja la pantalla, así nunca queda desactualizado:

- **Monto del mes** de una tarjeta = suma de la cuota mensual de sus compras.
- **Saldo pendiente** = cuota mensual × cuotas que faltan (contando la actual). Ej: $100.000 al mes, 6 cuotas, va en la 2 → quedan 5 → $500.000.
- **Cupo disponible** = cupo total − saldo pendiente (nunca menos de 0).
- **Vencimiento**: compara el día de hoy con el día de vencimiento y dice "Quedan X días", "¡Paga hoy!" o "Atrasada por X días".

Para agregar un banco nuevo basta con sumar una línea en `constants/banks.ts`.

## Cosas pendientes y detalles conocidos

Revisado con `tsc` (sin errores) y `npm run lint` (2 errores y 2 advertencias, detallados abajo). En el código están marcados con comentarios que empiezan con "ojo".

- **Los datos no se guardan.** Viven en memoria, si se cierra o recarga la app se pierde todo. Faltaría AsyncStorage o similar.
- **Compra sobre el cupo:** `registrarTransaccion` la rechaza bien, pero la pantalla `RegistrarTransaccion.tsx` no revisa el resultado y muestra "Agregado correctamente" igual.
- **En web**, `Alert.alert` no se muestra: las validaciones del formulario de tarjeta no avisan nada y "Marcar mes como pagado" no hace nada. El formulario de compra sí está adaptado para web.
- En `detalle-tarjeta/[id].tsx` hay una clase mal escrita (`font  bold` en vez de `font-inter-bold`).
- En `_layout.tsx` el `useEffect` que esconde el splash está duplicado.
- El menú de abajo siempre marca "Inicio" como activo; Suscripciones y Proyecciones todavía no tienen pantalla.
- El vencimiento solo mira el día: un 31 en un mes de 30 días se muestra igual, y después de pagar el mes sigue saliendo "Atrasada".
- Por redondeo, la suma de las cuotas puede quedar un peso abajo del total.
- Lint: comillas sin escapar en `Tarjetas.tsx` (error), `pathname` sin usar en el menú y falta `router` en las dependencias de un `useEffect` (advertencias).
- `package.json` todavía tiene el script `reset-project` de la plantilla, pero la carpeta `scripts/` no existe. El nombre de la app en `app.json` sigue siendo "NativeWind".
