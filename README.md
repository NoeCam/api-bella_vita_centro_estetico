# BACKEND PARA BELLA VITA Centro estético
*Realizado por Noelia Camelia*

<ins>Se centra en la realización del backend necesario para la reserva de citas del centro estético</ins>
<ins>Realizado con Node.js y Express.js</ins>

## Para inicializar la base de datos: 
    - Duplicar el archivo .env.example y cambiar el nombre a .env 
    - Definir todas las variables de entornos declaradas en .env
    - Utilice, en consola, el comando: npm run initDB

## Para inicializar el proyecto en formato desarrollador:
    - Utilice, en consola, el comando: npm run dev

## Tablas de la base de datos: 

### Pacientes
```
- id
- Nombre
- Apellido
- email
- teléfono
- fecha de creación
- fecha de modificación
```

### Tratamientos
```
- id
- nombre del tratamiento
- tipo de tratamiento
- subtipo de tratamiento
- descripción
- tiempo utilizado para la realización
- precio
- imagen
- fecha de creación
- fecha de modificación
```

### Administradores (un administrador/a es un/a cosmetólogo/a)
```
- id
- Nombre
- Apellido
- imagen
- email
- celular
- contraseña 
- fecha de creación
- fecha de modificación
```

### Horario laboral de los administradores 
```
- id
- adminId
- día laboral
- comienzo de horario laboral
- fin del horario laboral
```

### Tratamientos que realiza cada administrador 
```
- id
- id identificador del administrador
- id del tratamiento que realiza
```

### Citas
```
- id
- id del paciente
- id del tratamiento
- id del administrador
- fecha de la cita
- hora de inicio de la cita
- hora de fin de la cita
- estado (El mismo solo puede ser: Pendiente, Confirmado, Cancelado)
```

## Endpoints
- GET "/": Página principal, donde se podrá ver cada uno de los tratamientos que se realizan en el centro estético.
- GET "/time-appointments?treatmentId=2&date=2025-03-03": El paciente puede ver los horarios disponibles que hay para un tratamiento específico en una fecha en particular, y ser capaz de reservar turno luego de ingresar los datos solicitados en el formulario.
- POST "booking-appointments?treatmentId=2&date=2025-03-03": El paciente es capaz de reservar turno luego de ingresar los datos solicitados en el formulario. 

- "/admin": Para modificación de los horarios disponibles, acceso mediante autenticación, únicamente para administradores