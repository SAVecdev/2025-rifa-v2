// Verificar si Chart.js se cargó correctamente
if (typeof Chart === 'undefined') {
    console.error('❌ Chart.js no se cargó correctamente');
    alert('Error: Chart.js no se pudo cargar. Verifique la conexión.');
} else {
    console.log('✅ Chart.js cargado correctamente, versión:', Chart.version);
}

// Configuración del gráfico de líneas
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Inicializando Chart.js con datos reales...');
    
    const chartElement = document.getElementById('lineChart');
    if (!chartElement) {
        console.error('❌ No se encontró el elemento canvas con ID "lineChart"');
        return;
    }
    
    const ctx = chartElement.getContext('2d');
    
    // Función para mostrar/ocultar el loader
    function mostrarLoader(mostrar = true) {
        const loader = document.getElementById('chartLoader');
        const canvas = document.getElementById('lineChart');
        
        if (mostrar) {
            if (loader) loader.style.display = 'flex';
            if (canvas) canvas.style.opacity = '0';
            console.log('🔄 Mostrando loader...');
        } else {
            if (loader) loader.style.display = 'none';
            if (canvas) canvas.style.opacity = '1';
            console.log('✅ Ocultando loader, mostrando chart...');
        }
    }
    
    // Mostrar loader al inicio
    mostrarLoader(true);
    
    // Función para cargar datos reales de la API
    async function cargarDatosReales() {
        try {
            console.log('🔄 Cargando estadísticas semanales...');
            
            const response = await fetch('/admin/api/estadisticas-semanales');
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Datos cargados exitosamente:', result.data);
                return result.data;
            } else {
                console.error('❌ Error en la respuesta:', result.message);
                return null;
            }
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            return null;
        }
    }
    
    // Función para inicializar el chart
    async function inicializarChart() {
        // Simular un pequeño delay para mostrar el loader
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const datosReales = await cargarDatosReales();
        
        let labels, utilidadData;
        
        if (datosReales) {
            // Usar datos reales
            labels = datosReales.labels;
            utilidadData = datosReales.valores;
            console.log('📈 Usando datos reales:', { labels: labels.length, valores: utilidadData.length });
        } else {
            // Datos de respaldo en caso de error
            console.log('⚠️ Usando datos de respaldo');
            labels = ['15 Nov', '16 Nov', '17 Nov', '18 Nov', '19 Nov', '20 Nov', '21 Nov', '22 Nov'];
            utilidadData = [1200, 1400, 1100, 1600, 1300, 1800, 1500, 1700];
        }
        
        // Crear el chart con los datos
        window.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Utilidad Total',
                        data: utilidadData,
                        borderColor: '#4ade80', // green-400
                        backgroundColor: 'rgba(74, 222, 128, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#4ade80',
                        pointBorderColor: '#1e293b',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#cbd5e1', // slate-300
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b', // slate-800
                        titleColor: '#f1f5f9', // slate-100
                        bodyColor: '#cbd5e1', // slate-300
                        borderColor: '#475569', // slate-600
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#475569', // slate-600
                            borderColor: '#64748b' // slate-500
                        },
                        ticks: {
                            color: '#cbd5e1', // slate-300
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#475569', // slate-600
                            borderColor: '#64748b' // slate-500
                        },
                        ticks: {
                            color: '#cbd5e1', // slate-300
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#f1f5f9'
                    }
                },
                animation: {
                    onComplete: function() {
                        // Ocultar loader cuando la animación del chart termine
                        mostrarLoader(false);
                    }
                }
            }
        });
        
        console.log('✅ Gráfico inicializado correctamente');
    }
    
    // Función para actualizar los datos del gráfico
    window.actualizarChart = async function() {
        console.log('🔄 Actualizando datos del gráfico...');
        mostrarLoader(true);
        
        const datosReales = await cargarDatosReales();
        
        if (datosReales && window.lineChart) {
            window.lineChart.data.labels = datosReales.labels;
            window.lineChart.data.datasets[0].data = datosReales.valores;
            window.lineChart.update();
            console.log('✅ Gráfico actualizado');
        }
        
        // El loader se ocultará automáticamente cuando termine la animación
    };
    
    // Inicializar el chart
    inicializarChart();
});
