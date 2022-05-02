
//La siguiente línea da forma a la pelota: 
    canvasContext.arc(pelotaEjeX, 100, 8, 0, Math.PI*2, true);
    //primer y segundo argumento nos sitúan en el centro del círculo.
    //El tercer argumento determina el radio del círculo en px
    //cuarto y quinto argumento determinan el ángulo y el número de veces que el radio recorre la circunferencia (0, PI*2)
    //el boolean determina si el ángulo es negativo o positivo