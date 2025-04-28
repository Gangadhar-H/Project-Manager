import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const fetchProjectAndTasks = async () => {
        try {
            setLoading(true);
            const projectRes = await api.get(`/api/projects/${id}`);
            setProject(projectRes.data.data);
            setFormData({
                name: projectRes.data.data.name,
                description: projectRes.data.data.description
            });

            const tasksRes = await api.get(`/api/tasks/project/${id}`);
            setTasks(tasksRes.data.data);
            setError('');
        } catch (err) {
            setError('Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectAndTasks();
    }, [id]);

    const handleTaskCreated = (newTask) => {
        setTasks([newTask, ...tasks]);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const res = await api.put(`/api/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map(task => task._id === taskId ? res.data.data : task));
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await api.delete(`/api/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/api/projects/${id}`, formData);
            setProject(res.data.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update project');
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm('Are you sure you want to delete this project? All associated tasks will be deleted.')) {
            return;
        }

        try {
            await api.delete(`/api/projects/${id}`);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to delete project');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Project Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input h-32"
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
                                <p className="text-gray-600 mb-4">{project.description}</p>
                                <p className="text-sm text-gray-500">
                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleDeleteProject}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Tasks</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Task
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No tasks yet</h3>
                    <p className="text-gray-600 mb-4">Add your first task to this project</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary"
                    >
                        Add Task
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </div>
            )}

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={id}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    );
};

export default ProjectDetail;