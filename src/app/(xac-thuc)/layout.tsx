import ImagesContainer from "@/app/(xac-thuc)/components/ImagesContainer";
import SwitchButtons from "@/app/(xac-thuc)/components/SwitchButtons";

export default function AuthLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-12 lg:space-x-[111px] py-[38px]">
            <div className="col-span-12 lg:col-span-6 hidden lg:block">
                <ImagesContainer/>
            </div>
            <div className="col-span-12 lg:col-span-6">
                <div className="flex flex-col items-center w-full">
                    <h1 className="mb-6">Chào mừng đến với dự án học tiếng Anh</h1>
                    <SwitchButtons/>
                    <p className="text-base font-normal mt-[52px] mb-[42px]">Lorem Ipsum is simply dummy text of the
                        printing and typesetting industry.</p>
                </div>
                <div className="">
                    {children}
                </div>
            </div>
        </div>
    );
}