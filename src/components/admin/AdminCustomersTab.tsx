import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  Phone,
  Mail,
  Award,
  MapPin,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { CustomerRecord } from '../../types';
import { firestoreRepo } from '../../services/firebase';

export const AdminCustomersTab: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState<CustomerRecord | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rewardPoints, setRewardPoints] = useState('250');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [street, setStreet] = useState('Lane 7, Koregaon Park');
  const [city, setCity] = useState('Pune');
  const [pincode, setPincode] = useState('411001');

  // Deletion State
  const [custToDelete, setCustToDelete] = useState<CustomerRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCustomers(firestoreRepo.getCustomers());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingCust(null);
    setName('');
    setEmail('');
    setPhone('+91 ');
    setRewardPoints('200');
    setRole('customer');
    setStreet('Lane 5, Koregaon Park');
    setCity('Pune');
    setPincode('411001');
    setIsModalOpen(true);
  };

  const openEditModal = (c: CustomerRecord) => {
    setEditingCust(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setRewardPoints(c.rewardPoints.toString());
    setRole(c.role);
    if (c.savedAddresses && c.savedAddresses.length > 0) {
      setStreet(c.savedAddresses[0].street);
      setCity(c.savedAddresses[0].city);
      setPincode(c.savedAddresses[0].pincode);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingCust) {
      const updated = firestoreRepo.updateCustomer(editingCust.uid, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        rewardPoints: parseInt(rewardPoints) || 0,
        role,
      });
      setCustomers(updated);
      showToast(`Updated customer "${name}".`);
    } else {
      const newCustomer: CustomerRecord = {
        uid: `user-patron-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        rewardPoints: parseInt(rewardPoints) || 100,
        createdAt: new Date().toISOString().split('T')[0],
        savedAddresses: [
          {
            id: `addr-${Date.now()}`,
            fullName: name.trim(),
            phone: phone.trim(),
            street: street.trim(),
            city: city.trim(),
            state: 'Maharashtra',
            pincode: pincode.trim(),
            isDefault: true
          }
        ]
      };
      firestoreRepo.saveCustomer(newCustomer);
      setCustomers(firestoreRepo.getCustomers());
      showToast(`Added customer profile "${name}".`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!custToDelete) return;
    const updated = firestoreRepo.deleteCustomer(custToDelete.uid);
    setCustomers(updated);
    showToast(`Deleted customer profile.`);
    setCustToDelete(null);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div id="admin-customers-tab" className="space-y-4">
      {toastMessage && (
        <div className="p-3 rounded-xl bg-[#4A154B] text-white text-xs font-semibold flex items-center space-x-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8D5C4] shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#4A154B] text-white">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-sm font-bold text-[#4A154B]">
              Registered Patrons & VIP Clients ({customers.length})
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Cloud Firestore collection: <code className="text-gray-700">customers</code>
          </p>
        </div>

        <button
          id="btn-add-customer"
          onClick={openAddModal}
          className="py-2 px-4 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by patron name, email, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#4A154B]"
        />
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden shadow-2xs">
        <div className="divide-y divide-gray-100">
          {filteredCustomers.map((cust) => {
            const isVip = cust.rewardPoints > 500;
            return (
              <div
                key={cust.uid}
                id={`customer-row-${cust.uid}`}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F9] transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] text-[#4A154B] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {cust.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-sm font-bold text-gray-900">
                        {cust.name}
                      </span>
                      {isVip && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center space-x-1">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>VIP Patron</span>
                        </span>
                      )}
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-50 text-[#4A154B]">
                        {cust.role}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{cust.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{cust.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1 font-mono text-[#4A154B] font-bold">
                        <Award className="w-3 h-3 text-[#B76E79]" />
                        <span>{cust.rewardPoints} Loyalty Points</span>
                      </span>
                    </div>

                    {cust.savedAddresses && cust.savedAddresses.length > 0 && (
                      <p className="text-[10px] text-gray-400 flex items-center space-x-1 pt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span>
                          {cust.savedAddresses[0].street}, {cust.savedAddresses[0].city} (
                          {cust.savedAddresses[0].pincode})
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => openEditModal(cust)}
                    className="py-1 px-3 rounded-lg border border-gray-200 text-gray-700 hover:text-[#4A154B] hover:bg-[#FAF0F3] text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setCustToDelete(cust)}
                    className="py-1 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-xs">
              No customers found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CUSTOMER */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#4A154B] text-white">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                    {editingCust ? 'Edit Customer Profile' : 'Enroll New Patron'}
                  </h3>
                  <span className="text-[10px] text-gray-500">Firestore Customer Schema</span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Princess Gayatri Devi"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@luxury.in"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Loyalty Points</label>
                  <input
                    type="number"
                    min="0"
                    value={rewardPoints}
                    onChange={(e) => setRewardPoints(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
                  >
                    <option value="customer">Standard Patron</option>
                    <option value="admin">Store Admin</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-bold text-gray-700 block text-[11px]">Primary Shipping Destination</span>
                <div>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street Address"
                    className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                  />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="PIN Code"
                    className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-customer"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold hover:bg-[#67226B] shadow-xs"
                >
                  {editingCust ? 'Save Profile' : 'Enroll Patron'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {custToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-rose-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900">Remove Patron</h4>
                <p className="text-[10px] text-gray-500">Customer record will be purged.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Are you sure you want to remove <strong className="text-gray-900">"{custToDelete.name}"</strong>?
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setCustToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-delete-customer"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
