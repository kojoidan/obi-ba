import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { axios } = useAppContext();

    useEffect(() => {
        const reference = searchParams.get('reference');
        const trxref = searchParams.get('trxref');

        // Check if payment was successful
        if (reference || trxref) {
            // Verify payment status (optional - you can verify with backend)
            // For now, just redirect to my-orders
            toast.success('Payment successful! Redirecting to your orders...');
            setTimeout(() => {
                navigate('/my-orders', { replace: true });
            }, 1500);
        } else {
            // If no reference, still redirect but show a message
            toast.success('Redirecting to your orders...');
            setTimeout(() => {
                navigate('/my-orders', { replace: true });
            }, 1000);
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Processing your payment...</p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
