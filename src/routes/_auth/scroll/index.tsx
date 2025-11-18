// import { PhoneNumberInput } from '@/components/base/MobileNumberInput';
import { ExampleInfiniteList } from '@/features/infinite-scroll/Scroll'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react';

export const Route = createFileRoute('/_auth/scroll/')({
  component: RouteComponent,
})

function RouteComponent() {

    // <ExamplePhoneForm></ExamplePhoneForm>
    <div></div>
}




// export  function ExamplePhoneForm() {
//   const [phone, setPhone] = useState<string>("");        // digits only (no + or country)
//   const [isVerified, setIsVerified] = useState<boolean>(false);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Example: final validation before sending to backend
//     if (phone.length !== 10) {
//       alert("Please enter a 10-digit phone number.");
//       return;
//     }
//     // send phone to server...
//     alert(`Submitting ${phone} (verified: ${isVerified})`);
//   };

//   const handleSendOtp = async () => {
//     if (phone.length !== 10) {
//       alert("Enter a valid 10-digit number first.");
//       return;
//     }
//     // Simulate sending OTP
//     // await api.sendOtp(`+91${phone}`)
//     alert(`OTP sent to +91${phone}`);
//     // You'd normally open a modal/field for OTP; here we just set verified for demo
//     // setIsVerified(true) after successful OTP validation
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md space-y-4">
//       <PhoneNumberInput
//         ref={inputRef}
//         value={phone}
//         onValueChange={(v) => {
//           // clear verification if user edits number after verification
//           if (isVerified && v !== phone) setIsVerified(false);
//           setPhone(v);
//         }}
//         isVerified={isVerified}
//         maxLength={10}
//         countryCode="+91"
//         label="Mobile"
//         placeholder="Enter mobile number"
//         size="md"
//       />

//       <div className="flex gap-2">
//         <button
//           type="button"
//           onClick={handleSendOtp}
//           className="px-4 py-2 rounded bg-blue-600 text-white"
//         >
//           Send OTP
//         </button>

//         <button
//           type="button"
//           onClick={() => {
//             // fake verify flow
//             if (phone.length === 10) {
//               setIsVerified(true);
//               alert("Number verified (demo)");
//             } else {
//               alert("Enter a 10-digit number first");
//             }
//           }}
//           className="px-4 py-2 rounded bg-green-600 text-white"
//         >
//           I have OTP (verify)
//         </button>

//         <button type="submit" className="px-4 py-2 rounded border">
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// }

