/* ===================================
   GIDI Paisagismo - Budget Calculator
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
});

/* ===================================
   Calculator Initialization
   =================================== */
function initializeCalculator() {
    const tipoServico = document.getElementById('tipo-servico');
    const areaProjeto = document.getElementById('area-projeto');
    const irrigacaoAuto = document.getElementById('irrigacao-auto');
    const manutencaoMensal = document.getElementById('manutencao-mensal');
    const valorEstimado = document.getElementById('valor-estimado');

    // Initialize noUiSlider for complexity
    const complexidadeSlider = document.getElementById('complexidade-slider');

    if (typeof noUiSlider !== 'undefined' && complexidadeSlider) {
        noUiSlider.create(complexidadeSlider, {
            start: 1,
            connect: [true, false],
            step: 1,
            range: {
                'min': 0,
                'max': 2
            },
            tooltips: false,
            pips: {
                mode: 'steps',
                density: 50,
                format: {
                    to: function(value) {
                        const labels = ['Básico', 'Médio', 'Avançado'];
                        return labels[Math.round(value)];
                    }
                }
            }
        });

        // Custom styling for slider labels
        const pipValues = complexidadeSlider.querySelectorAll('.noUi-value');
        pipValues.forEach(pip => {
            pip.style.display = 'none';
        });

        // Update calculation when slider changes
        complexidadeSlider.noUiSlider.on('update', function() {
            calculateBudget();
        });
    }

    // Event listeners for all inputs
    if (tipoServico) tipoServico.addEventListener('change', calculateBudget);
    if (areaProjeto) areaProjeto.addEventListener('input', debounce(calculateBudget, 500));
    if (irrigacaoAuto) irrigacaoAuto.addEventListener('change', calculateBudget);
    if (manutencaoMensal) manutencaoMensal.addEventListener('change', calculateBudget);

    // Initial calculation
    calculateBudget();
}

/* ===================================
   Budget Calculation Logic
   =================================== */
function calculateBudget() {
    const tipoServico = document.getElementById('tipo-servico');
    const areaProjeto = document.getElementById('area-projeto');
    const complexidadeSlider = document.getElementById('complexidade-slider');
    const irrigacaoAuto = document.getElementById('irrigacao-auto');
    const manutencaoMensal = document.getElementById('manutencao-mensal');

    // Get values
    const servicoOption = tipoServico.options[tipoServico.selectedIndex];
    const basePrice = parseFloat(servicoOption.getAttribute('data-price')) || 0;
    const area = parseFloat(areaProjeto.value) || 0;
    let complexityMultiplier = 1;

    // Get complexity value from slider
    if (complexidadeSlider && complexidadeSlider.noUiSlider) {
        const complexityValue = complexidadeSlider.noUiSlider.get();
        const complexityIndex = Math.round(parseFloat(complexityValue));

        switch(complexityIndex) {
            case 0: // Básico
                complexityMultiplier = 1;
                break;
            case 1: // Médio
                complexityMultiplier = 1.5;
                break;
            case 2: // Avançado
                complexityMultiplier = 2.2;
                break;
        }
    }

    // Calculate base cost
    let totalMin = 0;
    let totalMax = 0;

    if (basePrice > 0 && area > 0) {
        const baseCost = basePrice * area * complexityMultiplier;
        totalMin = baseCost * 0.8; // -20%
        totalMax = baseCost * 1.2; // +20%

        // Add irrigation if selected
        if (irrigacaoAuto && irrigacaoAuto.checked) {
            totalMin += 2000;
            totalMax += 2500;
        }

        // Add maintenance (monthly, show annual estimate)
        if (manutencaoMensal && manutencaoMensal.checked) {
            totalMin += 500 * 12; // Annual
            totalMax += 650 * 12; // Annual
        }
    }

    // Update display
    updateBudgetDisplay(totalMin, totalMax, servicoOption.text, area, complexityMultiplier);
}

/* ===================================
   Update Budget Display
   =================================== */
function updateBudgetDisplay(min, max, servico, area, complexity) {
    const valorEstimado = document.getElementById('valor-estimado');
    const servicoSelecionado = document.getElementById('servico-selecionado');
    const areaSelecionada = document.getElementById('area-selecionada');
    const complexidadeSelecionada = document.getElementById('complexidade-selecionada');

    // Format currency
    const minFormatted = formatCurrency(min);
    const maxFormatted = formatCurrency(max);

    // Update value range
    if (valorEstimado) {
        if (min > 0 && max > 0) {
            valorEstimado.textContent = `${minFormatted} - ${maxFormatted}`;
            animateValue(valorEstimado, min, max);
        } else {
            valorEstimado.textContent = 'Preencha os campos acima';
        }
    }

    // Update details
    if (servicoSelecionado) {
        servicoSelecionado.textContent = servico || '-';
    }

    if (areaSelecionada) {
        areaSelecionada.textContent = area > 0 ? `${area} m²` : '-';
    }

    if (complexidadeSelecionada) {
        let complexityLabel = '-';
        if (complexity === 1) complexityLabel = 'Básico';
        else if (complexity === 1.5) complexityLabel = 'Médio';
        else if (complexity === 2.2) complexityLabel = 'Avançado';
        complexidadeSelecionada.textContent = complexityLabel;
    }
}

/* ===================================
   Format Currency (Brazilian Real)
   =================================== */
function formatCurrency(value) {
    if (value === 0 || isNaN(value)) return 'R$ 0';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

/* ===================================
   Animate Value Change
   =================================== */
function animateValue(element, min, max) {
    // Add animation class
    element.style.transition = 'all 0.3s ease-in-out';
    element.style.transform = 'scale(1.05)';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

/* ===================================
   Debounce Function
   =================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ===================================
   Price Table (for reference)
   =================================== */
const priceTable = {
    jardim: {
        base: 150, // R$/m²
        description: 'Projeto de Jardim',
        complexidade: {
            basico: 1.0,
            medio: 1.5,
            avancado: 2.2
        }
    },
    manutencao: {
        base: 80, // R$/m²
        description: 'Manutenção Paisagística',
        complexidade: {
            basico: 1.0,
            medio: 1.3,
            avancado: 1.6
        }
    },
    irrigacao: {
        base: 200, // R$/m²
        description: 'Irrigação Automatizada',
        complexidade: {
            basico: 1.0,
            medio: 1.4,
            avancado: 1.8
        }
    },
    vertical: {
        base: 300, // R$/m²
        description: 'Jardim Vertical',
        complexidade: {
            basico: 1.0,
            medio: 1.6,
            avancado: 2.5
        }
    },
    telhado: {
        base: 350, // R$/m²
        description: 'Telhado Verde',
        complexidade: {
            basico: 1.0,
            medio: 1.7,
            avancado: 2.8
        }
    },
    consultoria: {
        base: 120, // R$/m²
        description: 'Consultoria Ambiental',
        complexidade: {
            basico: 1.0,
            medio: 1.4,
            avancado: 2.0
        }
    }
};

/* ===================================
   Export Calculator Functions
   =================================== */
window.GIDICalculator = {
    calculateBudget,
    formatCurrency,
    priceTable
};

/* ===================================
   Calculator Tips & Help
   =================================== */
function showCalculatorTips() {
    const tips = [
        'Preços variam conforme a complexidade do projeto',
        'Irrigação automatizada economiza até 40% de água',
        'Manutenção regular garante a beleza do jardim',
        'Projetos maiores podem ter descontos especiais',
        'Entre em contato para orçamento personalizado'
    ];

    console.log('💡 Dicas da Calculadora GIDI:');
    tips.forEach((tip, index) => {
        console.log(`${index + 1}. ${tip}`);
    });
}

// Show tips on load (optional)
// showCalculatorTips();

/* ===================================
   Save/Load Calculator State (LocalStorage)
   =================================== */
function saveCalculatorState() {
    const state = {
        tipoServico: document.getElementById('tipo-servico').value,
        area: document.getElementById('area-projeto').value,
        irrigacao: document.getElementById('irrigacao-auto').checked,
        manutencao: document.getElementById('manutencao-mensal').checked
    };

    localStorage.setItem('gidiCalculatorState', JSON.stringify(state));
}

function loadCalculatorState() {
    const savedState = localStorage.getItem('gidiCalculatorState');

    if (savedState) {
        const state = JSON.parse(savedState);

        const tipoServico = document.getElementById('tipo-servico');
        const areaProjeto = document.getElementById('area-projeto');
        const irrigacaoAuto = document.getElementById('irrigacao-auto');
        const manutencaoMensal = document.getElementById('manutencao-mensal');

        if (tipoServico) tipoServico.value = state.tipoServico || '';
        if (areaProjeto) areaProjeto.value = state.area || 50;
        if (irrigacaoAuto) irrigacaoAuto.checked = state.irrigacao || false;
        if (manutencaoMensal) manutencaoMensal.checked = state.manutencao || false;

        calculateBudget();
    }
}

// Auto-save on input changes
document.addEventListener('DOMContentLoaded', function() {
    const inputs = [
        'tipo-servico',
        'area-projeto',
        'irrigacao-auto',
        'manutencao-mensal'
    ];

    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', saveCalculatorState);
        }
    });

    // Load saved state
    // loadCalculatorState(); // Uncomment to enable state persistence
});
