import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onDelete }) => {
    return (
        <div className="card hover:shadow-lg transition-shadow duration-200">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                    <button
                        onClick={() => onDelete(project._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-500">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                        to={`/projects/${project._id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;