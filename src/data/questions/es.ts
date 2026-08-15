import { AssessmentQuestion } from '../managerAssessment';

export const ES_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    dimension: 'reality',
    title: 'Discrepancia en Rendimiento de Producción',
    scenario: 'El panel mensual muestra una eficiencia del 92% en la línea de empaque, pero el almacén reporta desabastecimiento de productos para pedidos críticos.',
    options: [
      { id: 'a', score: 3, text: 'Confiar en el informe digital y exigir explicaciones al jefe de almacén por la carga perdida o no registrada.' },
      { id: 'b', score: 2, text: 'Pedir al gerente de producción que recalcule y revise las tablas de rendimiento.' },
      { id: 'c', score: 0, text: 'Ir personalmente a la planta y al almacén para observar directamente microparadas no registradas y mermas ocultas.' },
      { id: 'd', score: 1, text: 'Convocar una reunión conjunta entre producción, logística y ventas para conciliar los informes.' }
    ]
  },
  {
    id: 2,
    dimension: 'reality',
    title: 'Reclamación Crítica de Calidad de Cliente',
    scenario: 'Un cliente estratégico envía una queja formal indicando que la calidad del último lote despachado ha caído drásticamente.',
    options: [
      { id: 'a', score: 2, text: 'Sancionar o reprender de inmediato al equipo de control de calidad.' },
      { id: 'b', score: 0, text: 'Examinar muestras del lote, registros de control de calidad, bitácoras de turno y hablar directamente con el comprador.' },
      { id: 'c', score: 3, text: 'Indicar al equipo de ventas que otorgue un descuento en el próximo pedido para calmar al cliente.' },
      { id: 'd', score: 1, text: 'Ordenar la detención temporal de la línea hasta completar una revisión informal.' }
    ]
  },
  {
    id: 3,
    dimension: 'reality',
    title: 'Lote de Materia Prima con Descuento Sospechoso',
    scenario: 'Un proveedor histórico ofrece un lote de materia prima con un 15% de descuento, pero la validación técnica del laboratorio aún está pendiente.',
    options: [
      { id: 'a', score: 3, text: 'Autorizar la compra total de inmediato para aprovechar el ahorro financiero urgente.' },
      { id: 'b', score: 2, text: 'Permitir la compra de un tonelaje limitado sin prueba en línea, bajo responsabilidad del gerente de compras.' },
      { id: 'c', score: 0, text: 'Detener la compra a gran escala hasta realizar pruebas piloto y evaluar el impacto real en desperdicios.' },
      { id: 'd', score: 1, text: 'Exigir al proveedor una garantía escrita de calidad y proceder con la compra.' }
    ]
  },
  {
    id: 4,
    dimension: 'execution',
    title: 'Resoluciones Directivas Estancadas',
    scenario: 'En la reunión directiva se aprobaron 5 resoluciones clave para frenar desperdicios, pero tras dos semanas no se ha ejecutado ninguna acción tangible.',
    options: [
      { id: 'a', score: 3, text: 'Llamar la atención con dureza a los directivos en la siguiente junta y fijar ultimátums de emergencia.' },
      { id: 'b', score: 0, text: 'Asignar un único responsable empoderado, plazos estrictos, indicadores numéricos de resultado y seguimiento semanal.' },
      { id: 'c', score: 2, text: 'Asumir personalmente la gestión directa de las 5 tareas para acelerar el avance.' },
      { id: 'd', score: 1, text: 'Delegar el seguimiento en un consultor externo o en un comité ad-hoc.' }
    ]
  },
  {
    id: 5,
    dimension: 'execution',
    title: 'Retraso en Cronograma de Expansión de Planta',
    scenario: 'La puesta en marcha de una nueva línea de producción lleva 3 meses de retraso y acumula un sobrecosto presupuestario del 20%.',
    options: [
      { id: 'a', score: 3, text: 'Reemplazar de inmediato al contratista o rescindir el contrato del proyecto.' },
      { id: 'b', score: 2, text: 'Extender los plazos indefinidamente para aliviar la presión del equipo.' },
      { id: 'c', score: 0, text: 'Nombrar un líder con autoridad, auditar cuellos de botella en la ruta crítica, redefinir hitos y exigir revisiones semanales.' },
      { id: 'd', score: 1, text: 'Establecer reuniones diarias breves exigiendo reportes verbales de avance a todos.' }
    ]
  },
  {
    id: 6,
    dimension: 'execution',
    title: 'Crisis Operativa Repentina',
    scenario: 'Una avería crítica imprevista o una fuga de sustancias amenaza la producción, la seguridad de los trabajadores o la reputación de la empresa.',
    options: [
      { id: 'a', score: 0, text: 'Contener primero el peligro físico; aislar hechos verificados; definir responsable único, plan de acción y análisis post-crisis.' },
      { id: 'b', score: 3, text: 'Centralizar todas las decisiones de forma personal y emitir órdenes ejecutivas de emergencia.' },
      { id: 'c', score: 2, text: 'Postergar las decisiones de contención hasta recopilar el 100% de los datos analíticos.' },
      { id: 'd', score: 1, text: 'Aplicar una solución improvisada y aplazar la investigación sistemática para más adelante.' }
    ]
  },
  {
    id: 7,
    dimension: 'systems',
    title: 'Incremento Aislado de Producción en una Estación',
    scenario: 'Una estación de estampado incrementa su rendimiento un 30%, pero genera acumulación de inventario en proceso y retrasa el ensamble posterior.',
    options: [
      { id: 'a', score: 3, text: 'Elogiar públicamente al equipo de estampado y presionar al ensamble posterior para que aumente su velocidad.' },
      { id: 'b', score: 2, text: 'Reducir la velocidad de la estación de estampado a sus niveles históricos.' },
      { id: 'c', score: 0, text: 'Analizar el flujo completo de la cadena de valor, identificar la restricción real y medir el rendimiento global del sistema.' },
      { id: 'd', score: 1, text: 'Autorizar horas extras temporales en el ensamble mientras se investiga el desequilibrio.' }
    ]
  },
  {
    id: 8,
    dimension: 'systems',
    title: 'Presión para Recortar Presupuesto de Mantenimiento',
    scenario: 'Ante problemas coyunturales de liquidez, se propone recortar el mantenimiento preventivo en un 30%.',
    options: [
      { id: 'a', score: 3, text: 'Suspender de inmediato todo mantenimiento no urgente hasta que se recupere el flujo de caja.' },
      { id: 'b', score: 2, text: 'Instruir al jefe de mantenimiento para que recorte un 10% de forma lineal en todas las áreas.' },
      { id: 'c', score: 0, text: 'Evaluar probabilidad de fallas, costo por paradas, seguridad, deuda técnica y el impacto integral en la producción.' },
      { id: 'd', score: 1, text: 'Postergar tareas de bajo riesgo con umbrales de control monitoreados y fecha fija de revisión.' }
    ]
  },
  {
    id: 9,
    dimension: 'systems',
    title: 'Ventas a Crédito a Cliente Histórico con Deuda',
    scenario: 'Un cliente tradicional realiza un pedido de gran volumen, pero su estado de cuenta refleja saldos vencidos pendientes de pago.',
    options: [
      { id: 'a', score: 2, text: 'Aprobar la venta basándose únicamente en el volumen de compras recientes.' },
      { id: 'b', score: 3, text: 'Confiar en la relación personal de confianza y el historial de amistad de años.' },
      { id: 'c', score: 0, text: 'Auditar cuentas por cobrar, pagarés en curso, cadencia de pagos, margen de la transacción y capacidad de riesgo de la empresa.' },
      { id: 'd', score: 1, text: 'Fijar un límite de crédito más restrictivo y condicionar entregas posteriores a la liquidación de la primera cuota.' }
    ]
  },
  {
    id: 10,
    dimension: 'memory',
    title: 'Ausencia Repentina de Persona Clave',
    scenario: 'Un supervisor experimentado es hospitalizado de urgencia por dos semanas sin que exista un sustituto designado ni procesos documentados.',
    options: [
      { id: 'a', score: 3, text: 'Llamarlo continuamente a su teléfono personal para que la operación no se detenga.' },
      { id: 'b', score: 2, text: 'Distribuir las tareas diarias entre varios operarios según la intuición del momento.' },
      { id: 'c', score: 0, text: 'Apoyarse en procedimientos operativos estandarizados (SOPs), listas de verificación, accesos delegados y personal capacitado.' },
      { id: 'd', score: 1, text: 'Nombrar un encargado interino y documentar de inmediato el conocimiento no registrado dependiente de personas.' }
    ]
  },
  {
    id: 11,
    dimension: 'memory',
    title: 'Defecto Recurrente en Lote de Producción',
    scenario: 'Un error de calibración en la línea de producción se repite por tercera vez en el año a pesar de capacitaciones anteriores.',
    options: [
      { id: 'a', score: 3, text: 'Sancionar formalmente al operador para enviar una advertencia disciplinaria contundente.' },
      { id: 'b', score: 2, text: 'Repetir exactamente el mismo curso de capacitación en aula una vez más.' },
      { id: 'c', score: 0, text: 'Auditar el proceso raíz, herramientas, estándares de trabajo, incentivos, límites de autoridad y controles a prueba de error.' },
      { id: 'd', score: 1, text: 'Agregar un control de inspección temporal antes y después de la estación mientras se investiga la causa.' }
    ]
  },
  {
    id: 12,
    dimension: 'memory',
    title: 'Solución Innovadora Desarrollada por un Técnico',
    scenario: 'Un técnico de planta descubre un método que reduce el tiempo de ajuste de máquina de 45 a 12 minutos.',
    options: [
      { id: 'a', score: 2, text: 'Agradecerle verbalmente y dar por cerrado el tema.' },
      { id: 'b', score: 1, text: 'Emitir una circular informativa para conocimiento general de la empresa.' },
      { id: 'c', score: 3, text: 'Dejar la ejecución exclusivamente en manos de ese técnico, ya que él conoce mejor el método.' },
      { id: 'd', score: 0, text: 'Documentar, probar, estandarizar y capacitar a todos los turnos, definiendo indicadores para institucionalizar la mejora.' }
    ]
  },
  {
    id: 13,
    dimension: 'culture',
    title: 'Sugerencia de Mejora de un Operador de Primera Línea',
    scenario: 'Un operario de ensamble propone un cambio en el corte de chapa que afirma reducirá las mermas de material en un 10%.',
    options: [
      { id: 'a', score: 0, text: 'Evaluar la propuesta, probarla a escala piloto, comunicar resultados de forma transparente y recompensar el valor económico generado.' },
      { id: 'b', score: 2, text: 'Pedirle que registre su idea en el buzón o plataforma digital de sugerencias.' },
      { id: 'c', score: 1, text: 'Evaluar con intuición gerencial propia si vale la pena dedicar tiempo a revisar la idea.' },
      { id: 'd', score: 3, text: 'Recordar a los operarios que no deben intervenir en asuntos técnicos propios de los ingenieros y jefes.' }
    ]
  },
  {
    id: 14,
    dimension: 'culture',
    title: 'Reporte Honesto de Error Antes de la Entrega',
    scenario: 'Un empleado reporta voluntariamente un error propio de dosificación antes del despacho, evitando reclamaciones millonarias de clientes.',
    options: [
      { id: 'a', score: 3, text: 'Sancionar al empleado con rigor para dejar claro que no se toleran equivocaciones.' },
      { id: 'b', score: 0, text: 'Reconocer el reporte proactivo, aislar el lote y diferenciar el error honesto de la negligencia o mala fe.' },
      { id: 'c', score: 2, text: 'Ocultar el incidente internamente para evitar que el trabajador sea señalado.' },
      { id: 'd', score: 1, text: 'Dar una amonestación verbal privada y considerar el caso cerrado.' }
    ]
  },
  {
    id: 15,
    dimension: 'culture',
    title: 'Comisiones de Ventas vs Cartera Vencida y Devoluciones',
    scenario: 'Las comisiones comerciales elevaron la facturación bruta, pero las facturas impagadas, cheques devueltos y devoluciones aumentaron alarmantemente.',
    options: [
      { id: 'a', score: 3, text: 'Elevar las metas de ventas para compensar la fuga de liquidez con mayor volumen.' },
      { id: 'b', score: 2, text: 'Mantener el esquema actual de comisiones y advertir verbalmente a los vendedores sobre el cobro.' },
      { id: 'c', score: 0, text: 'Alinear los incentivos con ventas rentables efectivamente cobradas, bajas tasas de devolución y salud financiera de la relación.' },
      { id: 'd', score: 1, text: 'Condicionar todas las operaciones de riesgo a la aprobación directa del Director General.' }
    ]
  },
  {
    id: 16,
    dimension: 'data',
    title: 'Alta Producción Acompañada de Aumento de Quejas',
    scenario: 'El panel directivo refleja un aumento del 20% en tonelaje producido, pero las mermas y quejas de clientes alcanzan récords históricos.',
    options: [
      { id: 'a', score: 3, text: 'Celebrar el récord de producción y gestionar las quejas de clientes de forma aislada.' },
      { id: 'b', score: 2, text: 'Culpar al departamento de calidad por no controlar el ritmo de la producción acelerada.' },
      { id: 'c', score: 0, text: 'Verificar la validez de los datos y evaluar en conjunto producción conforme, mermas, devoluciones, margen y quejas.' },
      { id: 'd', score: 1, text: 'Limitar temporalmente el aumento de producción hasta clarificar la situación.' }
    ]
  },
  {
    id: 17,
    dimension: 'data',
    title: 'Recomendación de Algoritmo / Sistema de IA',
    scenario: 'El modelo automatizado de scoring crediticio recomienda suspender las ventas a crédito a un distribuidor tradicional e influyente.',
    options: [
      { id: 'a', score: 3, text: 'Aplicar a ciegas la recomendación del sistema asumiendo que el algoritmo procesa más variables.' },
      { id: 'b', score: 2, text: 'Ignorar completamente el sistema y aprobar la venta basándose en la intuición gerencial.' },
      { id: 'c', score: 0, text: 'Usar el resultado como evidencia de apoyo, evaluando el modelo frente a reglas de gobernanza, umbrales y responsabilidad humana.' },
      { id: 'd', score: 1, text: 'Derivar la decisión al Director Financiero para su firma manual y archivar el caso.' }
    ]
  },
  {
    id: 18,
    dimension: 'data',
    title: 'Métricas Departamentales Conflictivas',
    scenario: 'Finanzas, Ventas y Almacén presentan tres cifras totalmente incompatibles sobre la valoración del inventario.',
    options: [
      { id: 'a', score: 3, text: 'Aceptar la cifra del Director Financiero por tener mayor rango jerárquico.' },
      { id: 'b', score: 2, text: 'Calcular el promedio matemático de las tres cifras como base de trabajo.' },
      { id: 'c', score: 0, text: 'Definir el indicador, la fuente única de verdad (SSOT), el momento de registro, los responsables y la causa raíz de la discrepancia.' },
      { id: 'd', score: 1, text: 'Adoptar una estimación conservadora documentada y fijar una fecha límite estricta para conciliar datos.' }
    ]
  },
  {
    id: 19,
    dimension: 'operations',
    title: 'Aumento de Ventas con Caída en Beneficio Operativo',
    scenario: 'La facturación bruta subió un 25%, pero el margen operativo neto y la liquidez disponible en caja continúan deteriorándose.',
    options: [
      { id: 'a', score: 3, text: 'Aumentar aún más el volumen de producción y ventas para diluir costos fijos.' },
      { id: 'b', score: 2, text: 'Aplicar un aumento general del 10% a todos los productos del catálogo sin análisis previo.' },
      { id: 'c', score: 0, text: 'Analizar la rentabilidad por SKU, segmento de clientes, líneas, mermas, descuentos, ciclo de cobranza y sustitución de insumos.' },
      { id: 'd', score: 1, text: 'Frenar temporalmente la producción de productos visiblemente no rentables mientras se concluye el análisis.' }
    ]
  },
  {
    id: 20,
    dimension: 'operations',
    title: 'Defecto Menor Crónico Aceptado por Costumbre',
    scenario: 'Existe una pequeña imperfección estética recurrente en los productos finales que los operarios normalizan diciendo: «Siempre ha sido así».',
    options: [
      { id: 'a', score: 3, text: 'Ignorar el defecto mientras los clientes no reclamen formalmente.' },
      { id: 'b', score: 2, text: 'Incrementar el número de inspectores de control de calidad al final de la línea.' },
      { id: 'c', score: 0, text: 'Rastrear la causa raíz en el proceso inicial, implementar un cambio controlado y actualizar los procedimientos estándar.' },
      { id: 'd', score: 1, text: 'Separar los lotes afectados y programar una revisión técnica con fecha límite.' }
    ]
  },
  {
    id: 21,
    dimension: 'operations',
    title: 'Microparadas Recurrentes de 5 Minutos',
    scenario: 'La línea principal de producción se detiene de 6 a 8 veces por turno durante unos 5 minutos cada vez, siendo consideradas normales por el personal.',
    options: [
      { id: 'a', score: 3, text: 'Como cada parada es muy corta, considerarlas intrascendentes y no intervenir.' },
      { id: 'b', score: 2, text: 'Compensar el tonelaje perdido programando horas extras durante los fines de semana.' },
      { id: 'c', score: 0, text: 'Registrar frecuencia, duración, causas y costo económico acumulado, midiendo su impacto exacto sobre el cuello de botella.' },
      { id: 'd', score: 1, text: 'Crear una línea de reserva temporal y establecer un plazo estricto de resolución técnica.' }
    ]
  },
  {
    id: 22,
    dimension: 'market',
    title: 'Exigencia Agresiva de Descuento por Distribuidor Clave',
    scenario: 'Un distribuidor estratégico exige un 15% de descuento adicional inmediato, amenazando con traspasar todas sus compras a un competidor.',
    options: [
      { id: 'a', score: 2, text: 'Aceptar el descuento de inmediato para retener el volumen de ventas.' },
      { id: 'b', score: 1, text: 'Rechazar tajantemente la solicitud para defender la dignidad de precios de la empresa.' },
      { id: 'c', score: 0, text: 'Analizar costos de cambio del cliente, valor percibido, margen de contribución, plazos y paquetes de servicio no vinculados a precio.' },
      { id: 'd', score: 3, text: 'Otorgar el descuento solicitado pero reducir sutilmente la calidad o el nivel de servicio.' }
    ]
  },
  {
    id: 23,
    dimension: 'market',
    title: 'Gran Pedido de Cliente con Historial Moroso',
    scenario: 'Un cliente conocido por demoras sistemáticas en sus pagos realiza un pedido de gran envergadura con alto margen nominal.',
    options: [
      { id: 'a', score: 3, text: 'Aceptar el contrato de inmediato; el crecimiento en ventas brutas siempre beneficia a la empresa.' },
      { id: 'b', score: 1, text: 'Rechazar el pedido de inmediato sin iniciar ninguna negociación.' },
      { id: 'c', score: 0, text: 'Evaluar margen, capacidad de planta, historial de cobro y garantías, fijando anticipos, límites de crédito o entregas por fases.' },
      { id: 'd', score: 2, text: 'Aceptar el contrato con el compromiso verbal y el apretón de manos del director comercial.' }
    ]
  },
  {
    id: 24,
    dimension: 'market',
    title: 'Promesa de Entrega Irrealista para Cerrar Contrato',
    scenario: 'Un cliente estratégico exige recibir su pedido en la mitad del plazo estándar habitual, encontrándose la fábrica al 100% de su capacidad.',
    options: [
      { id: 'a', score: 3, text: 'Aceptar el plazo imposible y luego presionar con rigor a la planta de producción para intentar cumplir.' },
      { id: 'b', score: 1, text: 'Rechazar de plano la propuesta y negarse a negociar alternativas.' },
      { id: 'c', score: 0, text: 'Informar de forma transparente la capacidad real, ofreciendo un cronograma fiable, entregas parciales o alternativas de prioridad.' },
      { id: 'd', score: 2, text: 'Decir al cliente que se intentará hacer lo posible, confiando en que surja un hueco imprevisto en la programación.' }
    ]
  }
];
