import { toast } from "react-hot-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContent = ({ message, icon: Icon, bgColor, borderColor }) => (
  <div className={`${bgColor} ${borderColor} border-l-4 px-4 py-3 rounded shadow-lg flex items-center gap-3 max-w-md font-montserrat`}>
    <Icon size={20} className="flex-shrink-0" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);

export const showSuccess = (message) => {
  toast.custom((t) => (
    <ToastContent
      message={message}
      icon={CheckCircle}
      bgColor="bg-emerald-50"
      borderColor="border-emerald-500 text-emerald-700"
    />
  ), {
    duration: 4000,
    style: {
      padding: 0,
      background: "transparent",
      boxShadow: "none",
    },
  });
};

export const showError = (message) => {
  toast.custom((t) => (
    <ToastContent
      message={message}
      icon={AlertCircle}
      bgColor="bg-red-50"
      borderColor="border-red-500 text-red-700"
    />
  ), {
    duration: 4000,
    style: {
      padding: 0,
      background: "transparent",
      boxShadow: "none",
    },
  });
};

export const showInfo = (message) => {
  toast.custom((t) => (
    <ToastContent
      message={message}
      icon={Info}
      bgColor="bg-[#bee9e8]"
      borderColor="border-[#62b6cb] text-[#1b4965]"
    />
  ), {
    duration: 4000,
    style: {
      padding: 0,
      background: "transparent",
      boxShadow: "none",
    },
  });
};

export const showWarning = (message) => {
  toast.custom((t) => (
    <ToastContent
      message={message}
      icon={AlertTriangle}
      bgColor="bg-amber-50"
      borderColor="border-amber-500 text-amber-700"
    />
  ), {
    duration: 4000,
    style: {
      padding: 0,
      background: "transparent",
      boxShadow: "none",
    },
  });
};