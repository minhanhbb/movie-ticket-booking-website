import React, { useState } from 'react';
import { useCountryContext } from '../../../Context/CountriesContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';
import './CountriesDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CountriesDashboard: React.FC = () => {    
    const { state, deleteCountry } = useCountryContext();
    const { countries } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const countriesPerPage = 7;

    const filteredCountries = countries.filter(country =>
        country.location_name &&
        country.location_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCountries = filteredCountries.length;
    const totalPages = Math.ceil(totalCountries / countriesPerPage);

    const currentCountries = filteredCountries.slice(
        (currentPage - 1) * countriesPerPage,
        currentPage * countriesPerPage
    );

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa quốc gia này?");
        if (confirmDelete) {
            await deleteCountry(id);
            notification.success({
                message: 'Xóa thành công',
                description: 'Quốc gia đã được xóa thành công.',
                placement: 'topRight',
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const pageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pages.push(i);
                }
                pages.push('...');
            } else if (currentPage >= totalPages - 2) {
                pages.unshift('...');
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.unshift('...');
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
                pages.push('...');
            }
        }

        return pages;
    };

    return (
        
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link to={'/admin/countries/add'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <FontAwesomeIcon icon={faPlus} />    Thêm Khu Vực
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên khu vực"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
                />
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center">ID</th>
                            <th className="px-4 py-2 text-center">Tên Khu Vực</th>
                            <th className="px-4 py-2 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCountries.map((country) => (
                            <tr key={country.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center">{country.id}</td>
                                <td className="px-4 py-3 text-center">{country.location_name}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <button
                                            onClick={() => handleDelete(country.id)}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentCountries.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    Không có khu vực nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-6">
                <nav className="flex space-x-2">
                    <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Trước
                    </button>
                    {pageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page as number)}
                            className={`px-4 py-2 rounded-lg border ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Tiếp
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default CountriesDashboard;
