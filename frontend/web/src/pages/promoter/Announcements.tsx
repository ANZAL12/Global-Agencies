import { useEffect, useState } from 'react';
import api from '../../services/api';

type Announcement = {
    id: number;
    title: string;
    description: string;
    image: string | null;
    created_at: string;
};

export default function PromoterAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements/');
            setAnnouncements(res.data);
        } catch (error) {
            console.error('Failed to fetch announcements', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-1 justify-center items-center h-full bg-[#f5f5f5]">
                <div className="w-8 h-8 border-4 border-[#1976d2] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#f5f5f5] min-h-[calc(100vh-130px)] pb-[80px]">
            {announcements.length === 0 ? (
                <div className="flex justify-center p-[40px] pt-[60px]">
                    <p className="text-[16px] text-[#888] text-center">No announcements available.</p>
                </div>
            ) : (
                <div className="pt-[15px]">
                    {announcements.map((item) => (
                        <div key={item.id} className="bg-white mx-[15px] mb-[15px] p-[15px] rounded-[8px] shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
                            <h3 className="text-[20px] font-bold text-[#333] mb-[5px]">{item.title}</h3>
                            <p className="text-[12px] text-[#888] mb-[10px]">
                                {new Date(item.created_at).toLocaleDateString()}
                            </p>

                            {item.image && (
                                <img
                                    src={`http://127.0.0.1:8000${item.image}`}
                                    alt="Announcement"
                                    className="w-full h-[150px] object-cover rounded-[8px] mb-[10px]"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            )}

                            <p className="text-[16px] text-[#555] leading-[24px]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
