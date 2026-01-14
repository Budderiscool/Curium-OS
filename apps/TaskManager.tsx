
import React from 'react';

const TaskManager: React.FC = () => {
  return (
    <div className="h-full bg-[#0d0d0d] p-4">
      <div className="bg-white/5 border border-white/10 rounded overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-white/10 text-gray-400">
            <tr>
              <th className="px-4 py-2">Process</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">CPU</th>
            </tr>
          </thead>
          <tbody className="text-white">
            <tr className="border-t border-white/5">
              <td className="px-4 py-3">Kernel Runtime</td>
              <td className="px-4 py-3 text-green-400">Stable</td>
              <td className="px-4 py-3">0.2%</td>
            </tr>
            <tr className="border-t border-white/5">
              <td className="px-4 py-3">Shell UI</td>
              <td className="px-4 py-3 text-green-400">Active</td>
              <td className="px-4 py-3">1.5%</td>
            </tr>
            <tr className="border-t border-white/5">
              <td className="px-4 py-3">VFS Manager</td>
              <td className="px-4 py-3 text-green-400">Active</td>
              <td className="px-4 py-3">0.1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;
