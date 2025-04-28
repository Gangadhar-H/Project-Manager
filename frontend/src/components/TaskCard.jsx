import { useState } from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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

    return (
        <div className="card mb-4 hover:shadow-lg transition-shadow duration-200">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                        <div className="flex space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[task.status]}`}>
                                {task.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                                {task.priority} Priority
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            to={`/tasks/${task._id}`}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </Link>
                        <button
                            onClick={() => onDelete(task._id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </button>

                {isExpanded && (
                    <div className="mt-2">
                        <p className="text-gray-600">{task.description}</p>

                        {task.dueDate && (
                            <p className="text-sm text-gray-500 mt-2">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                        )}

                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700">Change Status:</p>
                            <div className="flex space-x-2 mt-1">
                                <button
                                    onClick={() => onStatusChange(task._id, 'Not Started')}
                                    className={`px-2 py-1 rounded-md text-xs ${task.status === 'Not Started' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}
                                >
                                    Not Started
                                </button>
                                <button
                                    onClick={() => onStatusChange(task._id, 'In Progress')}
                                    className={`px-2 py-1 rounded-md text-xs ${task.status === 'In Progress' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                                >
                                    In Progress
                                </button>
                                <button
                                    onClick={() => onStatusChange(task._id, 'Completed')}
                                    className={`px-2 py-1 rounded-md text-xs ${task.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;