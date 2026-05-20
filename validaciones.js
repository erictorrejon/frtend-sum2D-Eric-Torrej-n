document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('ingresoForm');
  const confirmationScreen = document.getElementById('confirmationScreen');
  const orderNumberElement = document.getElementById('orderNumber');
  const newEntryButton = document.getElementById('newEntryButton');

  const nombre = document.getElementById('nombre');
  const dni = document.getElementById('dni');
  const email = document.getElementById('email');
  const confirmEmail = document.getElementById('confirm_email');
  const telefono = document.getElementById('telefono');
  const clienteRadios = document.querySelectorAll('input[name="cliente_tipo"]');
  const empresaFields = document.getElementById('empresaFields');
  const empresaNombre = document.getElementById('empresa_nombre');
  const empresaCuit = document.getElementById('empresa_cuit');
  const provincia = document.getElementById('provincia');
  const localidad = document.getElementById('localidad');
  const tipoEquipo = document.getElementById('tipo_equipo');
  const otroEquipoField = document.getElementById('otroEquipoField');
  const otroEquipo = document.getElementById('otro_equipo');
  const marcaEquipo = document.getElementById('marca_equipo');
  const otraMarcaField = document.getElementById('otraMarcaField');
  const otraMarca = document.getElementById('otra_marca');
  const modelo = document.getElementById('modelo');
  const so = document.getElementById('so');
  const garantia = document.getElementById('garantia');
  const garantiaField = document.getElementById('garantiaField');
  const garantiaDetalle = document.getElementById('garantia_detalle');
  const problemaTipo = document.getElementById('problema_tipo');
  const problemaTiempo = document.getElementById('problema_tiempo');
  const problemaFrecuenciaRadios = document.querySelectorAll('input[name="problema_frecuencia"]');
  const problemaDetalle = document.getElementById('problema_detalle');
  const yaIntento = document.getElementById('ya_intento');
  const intentoField = document.getElementById('intentoField');
  const intentoDetalle = document.getElementById('intento_detalle');
  const entregaRadios = document.querySelectorAll('input[name="entrega_modalidad"]');
  const direccionField = document.getElementById('direccionField');
  const direccion = document.getElementById('direccion');
  const contactoChecks = document.querySelectorAll('input[name="preferencia_contacto"]');
  const preferenciaWarning = document.getElementById('preferenciaWarning');

  function getFieldContainer(element) {
    return element.closest('.form-group') || element.closest('fieldset') || element.parentElement;
  }

  function getErrorMessageContainer(container) {
    let message = container.querySelector('.field-error-message');
    if (!message) {
      message = document.createElement('div');
      message.className = 'field-error-message';
      container.appendChild(message);
    }
    return message;
  }

  function setValidationState(element, valid, message) {
    const container = getFieldContainer(element);
    if (container) {
      container.classList.toggle('campo-error', !valid);
      container.classList.toggle('campo-ok', valid);
      const messageContainer = getErrorMessageContainer(container);
      messageContainer.textContent = valid ? '' : message;
      messageContainer.style.display = valid ? 'none' : 'block';
    }
    if (typeof element.setCustomValidity === 'function') {
      element.setCustomValidity(valid ? '' : message);
    }
  }

  function setGroupValidationState(name, valid, message) {
    const inputs = Array.from(document.querySelectorAll(`[name="${name}"]`));
    if (!inputs.length) return valid;
    inputs.forEach(input => {
      if (typeof input.setCustomValidity === 'function') {
        input.setCustomValidity(valid ? '' : message);
      }
    });
    const container = getFieldContainer(inputs[0]);
    if (container) {
      container.classList.toggle('campo-error', !valid);
      container.classList.toggle('campo-ok', valid);
      const messageContainer = getErrorMessageContainer(container);
      messageContainer.textContent = valid ? '' : message;
      messageContainer.style.display = valid ? 'none' : 'block';
    }
    return valid;
  }

  function validarNombre() {
    const value = nombre.value.trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/;
    if (value.length < 5 || value.length > 80) {
      setValidationState(nombre, false, 'El nombre completo debe tener entre 5 y 80 caracteres.');
      return false;
    }
    if (!regex.test(value)) {
      setValidationState(nombre, false, 'Usa solo letras y espacios en el nombre completo.');
      return false;
    }
    setValidationState(nombre, true, '');
    return true;
  }

  function validarDni() {
    const value = dni.value.trim();
    const regex = /^\d{7,8}$/;
    if (!regex.test(value)) {
      setValidationState(dni, false, 'El DNI debe tener solo números y entre 7 y 8 dígitos.');
      return false;
    }
    setValidationState(dni, true, '');
    return true;
  }

  function validarEmail() {
    const value = email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setValidationState(email, false, 'Ingresa un correo electrónico válido.');
      return false;
    }
    setValidationState(email, true, '');
    return true;
  }

  function validarConfirmEmail() {
    const value = confirmEmail.value.trim();
    if (value !== email.value.trim() || value === '') {
      setValidationState(confirmEmail, false, 'El correo de confirmación debe coincidir con el correo electrónico.');
      return false;
    }
    setValidationState(confirmEmail, true, '');
    return true;
  }

  function validarTelefono() {
    const value = telefono.value.trim();
    const allowed = /^[\d+\-\s]+$/;
    const digitCount = (value.match(/\d/g) || []).length;
    if (!allowed.test(value) || digitCount < 8) {
      setValidationState(telefono, false, 'El teléfono puede contener dígitos, +, guiones y espacios, y debe tener al menos 8 números.');
      return false;
    }
    setValidationState(telefono, true, '');
    return true;
  }

  function validarTipoCliente() {
    const checked = Array.from(clienteRadios).find(input => input.checked);
    return setGroupValidationState('cliente_tipo', Boolean(checked), 'Selecciona un tipo de cliente.');
  }

  function validarEmpresa() {
    if (document.querySelector('input[name="cliente_tipo"]:checked')?.value !== 'empresa') {
      if (empresaNombre) setValidationState(empresaNombre, true, '');
      if (empresaCuit) setValidationState(empresaCuit, true, '');
      return true;
    }
    let valido = true;
    const empresaValue = empresaNombre.value.trim();
    if (empresaValue.length === 0) {
      setValidationState(empresaNombre, false, 'El nombre de empresa es obligatorio para clientes empresa.');
      valido = false;
    } else {
      setValidationState(empresaNombre, true, '');
    }
    const cuitValue = empresaCuit.value.trim();
    const cuitRegex = /^(\d{2}-\d{8}-\d|\d{11})$/;
    if (!cuitRegex.test(cuitValue)) {
      setValidationState(empresaCuit, false, 'El CUIT debe ser ##-########-# o 11 dígitos sin guiones.');
      valido = false;
    } else {
      setValidationState(empresaCuit, true, '');
    }
    return valido;
  }

  function validarProvincia() {
    if (!provincia.value) {
      setValidationState(provincia, false, 'Selecciona una provincia.');
      return false;
    }
    setValidationState(provincia, true, '');
    return true;
  }

  function validarLocalidad() {
    const value = localidad.value.trim();
    if (value.length < 2) {
      setValidationState(localidad, false, 'La localidad debe tener al menos 2 caracteres.');
      return false;
    }
    setValidationState(localidad, true, '');
    return true;
  }

  function validarTipoEquipo() {
    if (!tipoEquipo.value) {
      setValidationState(tipoEquipo, false, 'Selecciona un tipo de dispositivo.');
      return false;
    }
    if (tipoEquipo.value === 'otro') {
      const value = otroEquipo.value.trim();
      if (value.length === 0) {
        setValidationState(otroEquipo, false, 'Especifica el dispositivo cuando eliges Otro.');
        return false;
      }
      setValidationState(otroEquipo, true, '');
    }
    setValidationState(tipoEquipo, true, '');
    return true;
  }

  function validarMarca() {
    if (!marcaEquipo.value) {
      setValidationState(marcaEquipo, false, 'Selecciona una marca.');
      return false;
    }
    if (marcaEquipo.value === 'Otra') {
      const value = otraMarca.value.trim();
      if (value.length === 0) {
        setValidationState(otraMarca, false, 'Especifica la marca cuando eliges Otra.');
        return false;
      }
      setValidationState(otraMarca, true, '');
    }
    setValidationState(marcaEquipo, true, '');
    return true;
  }

  function validarModelo() {
    const value = modelo.value.trim();
    if (value.length < 2) {
      setValidationState(modelo, false, 'El modelo debe tener al menos 2 caracteres.');
      return false;
    }
    setValidationState(modelo, true, '');
    return true;
  }

  function validarSO() {
    if (!so.value) {
      setValidationState(so, false, 'Selecciona el sistema operativo.');
      return false;
    }
    setValidationState(so, true, '');
    return true;
  }

  function validarGarantiaDetalle() {
    if (garantia.checked) {
      const value = garantiaDetalle.value.trim();
      if (value.length === 0) {
        setValidationState(garantiaDetalle, false, 'Ingresa el número de orden o la fecha de compra cuando tienes garantía.');
        return false;
      }
      setValidationState(garantiaDetalle, true, '');
      return true;
    }
    setValidationState(garantiaDetalle, true, '');
    return true;
  }

  function validarDireccion() {
    if (direccion && direccion.required) {
      const value = direccion.value.trim();
      if (value.length < 2) {
        setValidationState(direccion, false, 'La dirección debe tener al menos 2 caracteres si solicitas retiro a domicilio.');
        return false;
      }
      setValidationState(direccion, true, '');
      return true;
    }
    if (direccion) {
      setValidationState(direccion, true, '');
    }
    return true;
  }

  function validarProblemaTipo() {
    if (!problemaTipo.value) {
      setValidationState(problemaTipo, false, 'Selecciona el tipo de problema principal.');
      return false;
    }
    setValidationState(problemaTipo, true, '');
    return true;
  }

  function validarProblemaTiempo() {
    if (!problemaTiempo.value) {
      setValidationState(problemaTiempo, false, 'Selecciona desde cuándo ocurre el problema.');
      return false;
    }
    setValidationState(problemaTiempo, true, '');
    return true;
  }

  function validarProblemaFrecuencia() {
    const checked = Array.from(problemaFrecuenciaRadios).find(input => input.checked);
    return setGroupValidationState('problema_frecuencia', Boolean(checked), 'Selecciona si el problema es permanente o intermitente.');
  }

  function validarProblemaDetalle() {
    const value = problemaDetalle.value.trim();
    if (value.length < 20 || value.length > 500) {
      setValidationState(problemaDetalle, false, 'La descripción detallada debe tener entre 20 y 500 caracteres.');
      return false;
    }
    setValidationState(problemaDetalle, true, '');
    return true;
  }

  function validarIntentoPrevio() {
    if (!yaIntento.checked) {
      setValidationState(intentoDetalle, true, '');
      return true;
    }
    const value = intentoDetalle.value.trim();
    if (value.length > 300) {
      setValidationState(intentoDetalle, false, 'La descripción de intento previo no puede superar los 300 caracteres.');
      return false;
    }
    setValidationState(intentoDetalle, true, '');
    return true;
  }

  function validarContactoPreferido() {
    const selected = Array.from(contactoChecks).some(input => input.checked);
    if (!selected) {
      preferenciaWarning.style.display = 'block';
      return false;
    }
    preferenciaWarning.style.display = 'none';
    return true;
  }

  function toggleEmpresaFields() {
    const esEmpresa = document.querySelector('input[name="cliente_tipo"]:checked')?.value === 'empresa';
    empresaFields.classList.toggle('hidden', !esEmpresa);
    empresaNombre.required = esEmpresa;
    empresaCuit.required = esEmpresa;
    if (!esEmpresa) {
      empresaNombre.value = empresaNombre.value.trim();
      empresaCuit.value = empresaCuit.value.trim();
    }
  }

  function toggleOtroEquipo() {
    const mostrar = tipoEquipo.value === 'otro';
    otroEquipoField.classList.toggle('hidden', !mostrar);
    otroEquipo.required = mostrar;
    if (!mostrar) {
      setValidationState(otroEquipo, true, '');
    }
  }

  function toggleOtraMarca() {
    const mostrar = marcaEquipo.value === 'Otra';
    otraMarcaField.classList.toggle('hidden', !mostrar);
    otraMarca.required = mostrar;
    if (!mostrar) {
      setValidationState(otraMarca, true, '');
    }
  }

  function toggleGarantiaField() {
    garantiaField.classList.toggle('hidden', !garantia.checked);
    garantiaDetalle.required = garantia.checked;
    if (!garantia.checked) {
      setValidationState(garantiaDetalle, true, '');
    }
  }

  function toggleIntentoField() {
    intentoField.classList.toggle('hidden', !yaIntento.checked);
    intentoDetalle.required = false;
  }

  function toggleDireccionField() {
    const domicilio = Array.from(entregaRadios).find(input => input.checked)?.value === 'domicilio';
    direccionField.classList.toggle('hidden', !domicilio);
    if (direccion) {
      direccion.required = domicilio;
      if (!domicilio) {
        setValidationState(direccion, true, '');
      }
    }
  }

  function updateCounter(textarea, counterId) {
    const counter = document.getElementById(counterId);
    if (counter) {
      counter.textContent = textarea.value.length;
    }
  }

  function generarNumeroOrden() {
    const randomDigits = Math.floor(Math.random() * 900000 + 100000);
    return `ORD-${randomDigits}`;
  }

  function mostrarConfirmacion() {
    orderNumberElement.textContent = generarNumeroOrden();
    form.classList.add('hidden');
    confirmationScreen.classList.remove('hidden');
    confirmationScreen.setAttribute('tabindex', '-1');
    confirmationScreen.focus();
  }

  function reiniciarFormulario() {
    form.reset();
    confirmationScreen.classList.add('hidden');
    form.classList.remove('hidden');
    const allFields = form.querySelectorAll('input, select, textarea');
    allFields.forEach(field => {
      field.setCustomValidity('');
      const container = getFieldContainer(field);
      if (container) {
        container.classList.remove('campo-error', 'campo-ok');
        const message = container.querySelector('.field-error-message');
        if (message) {
          message.textContent = '';
          message.style.display = 'none';
        }
      }
    });
    toggleEmpresaFields();
    toggleOtroEquipo();
    toggleOtraMarca();
    toggleGarantiaField();
    toggleIntentoField();
    toggleDireccionField();
    updateCounter(problemaDetalle, 'problema_count');
    updateCounter(intentoDetalle, 'intento_count');
  }

  clienteRadios.forEach(radio => radio.addEventListener('change', () => {
    toggleEmpresaFields();
    validarTipoCliente();
    validarEmpresa();
  }));
  tipoEquipo.addEventListener('change', () => {
    toggleOtroEquipo();
    validarTipoEquipo();
  });
  marcaEquipo.addEventListener('change', () => {
    toggleOtraMarca();
    validarMarca();
  });
  garantia.addEventListener('change', () => {
    toggleGarantiaField();
    validarGarantiaDetalle();
  });
  yaIntento.addEventListener('change', () => {
    toggleIntentoField();
    validarIntentoPrevio();
  });
  entregaRadios.forEach(radio => radio.addEventListener('change', () => {
    toggleDireccionField();
  }));

  nombre.addEventListener('input', validarNombre);
  dni.addEventListener('input', validarDni);
  email.addEventListener('input', validarEmail);
  confirmEmail.addEventListener('input', validarConfirmEmail);
  telefono.addEventListener('input', validarTelefono);
  provincia.addEventListener('change', validarProvincia);
  localidad.addEventListener('input', validarLocalidad);
  tipoEquipo.addEventListener('change', validarTipoEquipo);
  otroEquipo.addEventListener('input', validarTipoEquipo);
  marcaEquipo.addEventListener('change', validarMarca);
  otraMarca.addEventListener('input', validarMarca);
  modelo.addEventListener('input', validarModelo);
  so.addEventListener('change', validarSO);
  garantiaDetalle.addEventListener('input', validarGarantiaDetalle);
  problemaTipo.addEventListener('change', validarProblemaTipo);
  problemaTiempo.addEventListener('change', validarProblemaTiempo);
  problemaFrecuenciaRadios.forEach(radio => radio.addEventListener('change', validarProblemaFrecuencia));
  problemaDetalle.addEventListener('input', () => {
    updateCounter(problemaDetalle, 'problema_count');
    validarProblemaDetalle();
  });
  intentoDetalle.addEventListener('input', () => {
    updateCounter(intentoDetalle, 'intento_count');
    validarIntentoPrevio();
  });
  contactoChecks.forEach(check => check.addEventListener('change', validarContactoPreferido));
  if (direccion) {
    direccion.addEventListener('input', () => {
      validarDireccion();
    });
  }

  form.addEventListener('reset', function () {
    window.setTimeout(() => {
      const allFields = form.querySelectorAll('input, select, textarea');
      allFields.forEach(field => {
        if (typeof field.setCustomValidity === 'function') {
          field.setCustomValidity('');
        }
        const container = getFieldContainer(field);
        if (container) {
          container.classList.remove('campo-error', 'campo-ok');
          const message = container.querySelector('.field-error-message');
          if (message) {
            message.textContent = '';
            message.style.display = 'none';
          }
        }
      });
      toggleEmpresaFields();
      toggleOtroEquipo();
      toggleOtraMarca();
      toggleGarantiaField();
      toggleIntentoField();
      toggleDireccionField();
      preferenciaWarning.style.display = 'none';
      updateCounter(problemaDetalle, 'problema_count');
      updateCounter(intentoDetalle, 'intento_count');
    }, 0);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const isValid = [
      validarNombre(),
      validarDni(),
      validarEmail(),
      validarConfirmEmail(),
      validarTelefono(),
      validarTipoCliente(),
      validarEmpresa(),
      validarProvincia(),
      validarLocalidad(),
      validarTipoEquipo(),
      validarMarca(),
      validarModelo(),
      validarSO(),
      validarGarantiaDetalle(),
      validarDireccion(),
      validarProblemaTipo(),
      validarProblemaTiempo(),
      validarProblemaFrecuencia(),
      validarProblemaDetalle(),
      validarIntentoPrevio(),
      validarContactoPreferido()
    ].every(Boolean);

    if (!isValid) {
      form.reportValidity();
      return;
    }

    mostrarConfirmacion();
  });

  newEntryButton.addEventListener('click', reiniciarFormulario);

  toggleEmpresaFields();
  toggleOtroEquipo();
  toggleOtraMarca();
  toggleGarantiaField();
  toggleIntentoField();
  toggleDireccionField();
  updateCounter(problemaDetalle, 'problema_count');
  updateCounter(intentoDetalle, 'intento_count');
});
