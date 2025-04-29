import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import CommentSection from '../components/CommentSection';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: ''
    });

    const fetchTask = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/tasks/${id}`);
            setTask(res.data.data);
            setFormData({
                title: res.data.data.title,
                description: res.data.data.description,
                status: res.data.data.status,
                priority: res.data.data.priority,
                dueDate: res.data.data.dueDate ? res.data.data.dueDate.split('T')[0] : ''
            });
            setError('');
        } catch (err) {
            setError('Failed to load task details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/api/tasks/${id}`, formData);
            setTask(res.data.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await api.delete(`/api/tasks/${id}`);
            navigate(`/projects/${task.projectId}`);
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    const statusColors = {
        'Not Started': 'bg-red-100 text-red-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800'
    };

    const priorityColors = {
        'Low': 'bg-blue-100 text-blue-800',
        'Medium': 'bg-purple-100 text-purple-800',
        'High': 'bg-red-100 text-red-800'
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !task) {
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
                            <label htmlFor="title" className="form-label">Task Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="priority" className="form-label">Priority</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dueDate" className="form-label">Due Date (Optional)</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="form-input"
                            />
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
                                <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
                                <div className="flex space-x-2 mb-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[task.status]}`}>
                                        {task.status}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                                        {task.priority} Priority
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 whitespace-pre-line">{task.description}</p>

                                <div className="mt-4 text-sm">
                                    <p>
                                        <span className="font-medium">Project: </span>
                                        <Link to={`/projects/${task.projectId}`} className="text-blue-600 hover:text-blue-800">
                                            Back to Project
                                        </Link>
                                    </p>
                                    {task.dueDate && (
                                        <p className="mt-1">
                                            <span className="font-medium">Due date: </span>
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    <p className="mt-1">
                                        <span className="font-medium">Created: </span>
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
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
                                    onClick={handleDeleteTask}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-2">Change Status:</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setFormData({ ...formData, status: 'Not Started' });
                                        handleSubmit({ preventDefault: () => { } });
                                    }}
                                    className={`px-3 py-1 rounded-md text-sm ${task.status === 'Not Started' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}
                                >
                                    Not Started
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({ ...formData, status: 'In Progress' });
                                        handleSubmit({ preventDefault: () => { } });
                                    }}
                                    className={`px-3 py-1 rounded-md text-sm ${task.status === 'In Progress' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                                >
                                    In Progress
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({ ...formData, status: 'Completed' });
                                        handleSubmit({ preventDefault: () => { } });
                                    }}
                                    className={`px-3 py-1 rounded-md text-sm ${task.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <CommentSection taskId={id} />
        </div>
    );
};

export default TaskDetail;