import { useEffect, useState } from "react";
 
const API_URL = "https://retoolapi.dev/f1D0Zs/dataGrupo2A";
 
const useDataTestSingers = () => {
  const [activeTab, setActiveTab] = useState("list"); // "list" or "form"
  const [dataTest, setDataTest] = useState([]); // List of records from the API.
  const [loading, setLoading] = useState(true); // Indicates if the data is being loaded from the API.
  const [submitting, setSubmitting] = useState(false); // Indicates if the form is being submitted to the API.
  const [error, setError] = useState(""); // Stores any error message from API operations.
  const [message, setMessage] = useState(""); // Stores success messages for create/update/delete operations.
 
  const [id, setId] = useState(""); // Stores the id of the record being edited. Empty when creating a new record.
  const [cancion, setCancion] = useState(""); // Stores the song field value in the form.
  const [cantante, setCantante] = useState(""); // Stores the singer field value in the form.
  const [nacionalidad, setNacionalidad] = useState(""); // Stores the nationality field value in the form.
 
  // Loads the records from the API and updates the list in state.
  const fetchDataTest = async () => {
    try {
        // Clear previous error and message, and set loading state.
      setLoading(true);
      setError("");
 
      // Fetch the data from the API and handle errors.
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("No se pudo obtener la información");
      }
 
      const data = await response.json();
      setDataTest(data);
    } catch (fetchError) {
      setError(fetchError.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };
 
  // Fetch the data once when the hook is mounted.
  useEffect(() => {
    fetchDataTest();
  }, []); // Empty dependency array means this runs once on mount.
 
  // Clears the form fields and removes the current record id.
  const resetForm = () => {
    setId("");
    setCancion("");
    setCantante("");
    setNacionalidad("");
  };
 
  // Opens the form in create mode with empty values.
  const openCreateForm = () => {
    resetForm();
    setMessage("");
    setActiveTab("form");
  };
 
  // Loads the selected record into the form so it can be edited.
  const handleEdit = (item) => {
    setId(item.id);
    setCancion(item.cancion ?? "");
    setCantante(item.cantante ?? "");
    setNacionalidad(item.nacionalidad ?? "");
    setMessage("");
    setActiveTab("form");
  };
 
  // Submits the form to create a new record or update an existing one.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedCancion = cancion.trim();
 
    if (!trimmedCancion) {
      setError("El nombre de la canción es obligatorio");
      return;
    }
 
    if (!cantante) {
      setError("El nombre del cantante es obligatorio");
      return;
    }
 
    if (!nacionalidad) {
      setError("La nacionalidad es obligatoria");
      return;
    }
 
    try {
      setSubmitting(true);
      setError("");
      setMessage("");
 
      const payload = {
        cancion: trimmedCancion,
        cantante: cantante,
        nacionalidad: nacionalidad,
      };
 
      const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
 
      if (!response.ok) {
        throw new Error(id ? "No se pudo actualizar" : "No se pudo crear");
      }
 
      setMessage(
        id
          ? "Registro actualizado correctamente"
          : "Registro creado correctamente",
      );
      resetForm();
      setActiveTab("list");
      fetchDataTest();
    } catch (submitError) {
      setError(submitError.message || "Error al guardar el registro");
    } finally {
      setSubmitting(false);
    }
  };
 
  // Deletes a record after confirmation and refreshes the list.
  const handleDelete = async (itemId) => {
    // Confirm deletion with the user
    const shouldDelete =
      typeof window === "undefined"
        ? true
        : window.confirm("¿Deseas eliminar este registro?");
 
    if (!shouldDelete) {
      return;
    }
 
    try {
      setError("");
      setMessage("");
 
      const response = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
      });
 
      if (!response.ok) {
        throw new Error("No se pudo eliminar el registro");
      }
 
      setMessage("Registro eliminado correctamente");
      await fetchDataTest();
 
      if (String(id) === String(itemId)) {
        resetForm();
        setActiveTab("list");
      }
    } catch (deleteError) {
      setError(deleteError.message || "Error al eliminar el registro");
    }
  };
 
  // Return all state and functions needed to manage the data and form.
  return {
    activeTab,
    setActiveTab,
    dataTest,
    loading,
    submitting,
    error,
    message,
    id,
    cancion,
    setCancion,
    cantante,
    setCantante,
    nacionalidad,
    setNacionalidad,
    fetchDataTest,
    openCreateForm,
    handleEdit,
    handleSubmit,
    handleDelete,
  };

};

export default useDataTestSingers;