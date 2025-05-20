document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProducto');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {
                tipo: formData.get('tipo'),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                precio: parseFloat(formData.get('precio')),
                stock: parseInt(formData.get('stock'), 10)
            };

            // Enviar los datos al backend usando fetch
            try {
                const response = await fetch('http://localhost:5165/api/producto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

                if (!response.ok) {
                    throw new Error('Error al guardar el producto');
                }

                // Opcional: manejar la respuesta del backend
                // const result = await response.json();
                // console.log('Respuesta del backend:', result);

                form.reset();
                alert('Producto guardado correctamente');
            } catch (error) {
                alert('Hubo un error al guardar el producto');
                console.error(error);
            }
        });
    }
});
