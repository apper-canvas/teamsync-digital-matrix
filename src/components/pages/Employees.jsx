import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  const loadEmployees = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee =>
      (employee.first_name_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.last_name_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.role_c || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleSuccess = () => {
    loadEmployees();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEmployees} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <Button onClick={handleAddEmployee} className="w-full sm:w-auto">
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Employee
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          placeholder="Search employees..."
          onSearch={handleSearch}
          className="max-w-md"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredEmployees.length > 0 ? (
          <EmployeeTable
            employees={filteredEmployees}
            departments={departments}
            onEdit={handleEditEmployee}
            onRefresh={loadEmployees}
          />
        ) : employees.length === 0 ? (
          <Empty
            title="No employees found"
            message="Start building your team by adding your first employee."
            actionLabel="Add Employee"
            onAction={handleAddEmployee}
            icon="UserPlus"
          />
        ) : (
          <Empty
            title="No matching employees"
            message="Try adjusting your search criteria to find employees."
            icon="Search"
          />
        )}
      </motion.div>

      <EmployeeModal
        isOpen={showModal}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Employees;