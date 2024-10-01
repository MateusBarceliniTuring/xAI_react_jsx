import React, { useEffect, useState } from "react";

const batchesData = ["react-batch-01"];

let tasksData = [
  {batch: "react-batch-01", task: "40888", taskName: 'Health Calculator', responses: ['']},
]

const Tasks = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentComponent, setCurrentComponent] = useState(null);

  // Fetch top-level batches
  useEffect(() => {
    const loadBatches = async () => {
      try {
        setBatches(batchesData);
        if (batchesData.length > 0) {
          // Set default folder to last one
          setSelectedBatch(batchesData[batchesData.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    loadBatches();
  }, []);

  // Load tasks when a batch is selected
  useEffect(() => {
    if (!selectedBatch) return;

    const loadTasks = async () => {
      try {
        for (let i = 0; i < tasksData.length; i++) {
          tasksData[i].responses = ["response_a", "response_b", "response_ideal"];
        }
        setTasks(tasksData);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    loadTasks();
  }, [selectedBatch]);

  // Handle batch selection change
  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  // Render selected component
  const handleComponentRender = async (task, response) => {
    try {
      setCurrentComponent(null);

      let componentModule;
      let file = `./tasks/${task.batch}/${task.task}/${response}/App.jsx`;

      componentModule = await import(file);

      if (componentModule) {
        setCurrentComponent(React.createElement(componentModule.default));
      }
    } catch (error) {
      console.error("Error loading component:", error);
    }
  };

  //useEffect(() => {
    // Load the component on the initial load
    // handleComponentRender(window.location.pathname);

    // Listen to browser back/forward navigation
    //const onPopState = () => {
    //  handleComponentRender(window.location.pathname);
    //};
    //window.addEventListener("popstate", onPopState);

    // Cleanup event listener on unmount
    //return () => {
    //  window.removeEventListener("popstate", onPopState);
    //};
  //}, []);

  return currentComponent ? (
    currentComponent
  ) : (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 my-8">
        Tasks by batch
      </h1>

      <div className="filter flex justify-center mb-8" style={{ alignItems: 'center' }}>
        <label htmlFor="batchSelect" className="text-lg text-gray-600 mr-4">
          Select the batch:
        </label>
        <select
          id="batchSelect"
          value={selectedBatch}
          onChange={handleBatchChange}
          className="p-3 bg-white border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
        >
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
      </div>

      <div id="tasksContainer" className="max-w-5xl mx-auto px-4">
        {tasks
          .filter((task) => task.batch === selectedBatch)
          .map((task) => (
          <div
            className="bg-white shadow-md rounded-lg p-6 mb-8 transform hover:-translate-y-2 hover:shadow-xl transition duration-300"
            key={task.task}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              {task.task} - {task.taskName}
            </h2>
            <div className="task-buttons flex justify-center flex-wrap mt-4">
              {task.responses.map((response) => {
                const buttonLabel = response.toUpperCase().replace("RESPONSE_", "");
                return (
                  <button
                    key={response}
                    onClick={() =>
                      //
                      {
                        window.history.pushState(
                          {},
                          "",
                          `${task.batch}/${task.task}/${response}`
                        );
                        handleComponentRender(task, response);
                      }
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md m-2 hover:bg-blue-700 transition duration-300"
                  >
                    {`Response ${buttonLabel}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
