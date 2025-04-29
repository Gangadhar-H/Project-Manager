import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { currentUser, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        country: currentUser?.country || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate passwords if the user is trying to change password
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setError('New passwords do not match');
                setLoading(false);
                return;
            }

            if (!formData.oldPassword) {
                setError('Current password is required to set a new password');
                setLoading(false);
                return;
            }
        }

        // Prepare data for API
        const updateData = {
            name: formData.name,
            country: formData.country
        };

        // Only include password fields if user is changing password
        if (formData.newPassword && formData.oldPassword) {
            updateData.oldPassword = formData.oldPassword;
            updateData.newPassword = formData.newPassword;
        }

        const result = await updateProfile(updateData);

        if (result.success) {
            setSuccess('Profile updated successfully');
            // Reset password fields
            setFormData({
                ...formData,
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia',
        'Germany', 'France', 'Japan', 'China', 'India', 'Brazil',
        'South Africa', 'Nigeria', 'Russia', 'Mexico', 'Other'
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
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
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            className="form-input bg-gray-100"
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="country" className="form-label">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="">Select your country</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-4">Change Password</h3>

                    <div className="form-group">
                        <label htmlFor="oldPassword" className="form-label">Current Password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="form-input"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            minLength="6"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;