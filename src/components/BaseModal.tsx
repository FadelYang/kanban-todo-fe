import { X } from "lucide-react";
import { Dispatch, JSX } from "react";

type BaseModalProps = {
  children: JSX.Element;
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

export const BaseModal = ({ children, isOpen, setIsOpen }: BaseModalProps) => {
  return (
    isOpen && (
      <>
        <div className="fixed inset-0 z-20 bg-black opacity-50"></div>
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center">
          <div className={`bg-white rounded-lg shadow p-6 min-w-80`}>
            <div className='flex justify-end mb-5'>
              <button className="cursor-pointer" type="button" onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>
            {children}
          </div>
        </div>
      </>
    )
  );
};
