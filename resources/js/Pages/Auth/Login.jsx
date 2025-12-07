import { Head, useForm } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function Login({ auth, errors: authErrors }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <Layout auth={auth}>
            <Head title="Login - SpiceLoop" />
            
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-md p-8 border border-spice-orange">
                    <h1 className="text-3xl font-bold text-spice-maroon mb-6 text-center">Login</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                required
                                autoFocus
                            />
                            {(errors.email || authErrors?.email) && (
                                <p className="text-red-500 text-sm mt-1">{errors.email || authErrors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                required
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                            />
                            <label className="ml-2 text-sm text-gray-600">Remember me</label>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-spice-orange hover:bg-spice-gold text-white py-3 rounded-lg font-semibold transition"
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

