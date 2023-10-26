'use client';

export default function Home() {
  return <div className="w-full flex items-center justify-center mt-[12px] p-2">
    <div
      className="flex flex-col items-center justify-center w-full p-2 h-max rounded-[8px] shadow-2xl md:w-[80%] md:p-4 md:shadow-xl"
    >
      <h1>This project aims at providing a thorough understanding of traffic condition.</h1>
      <p>Please contact Professor. Tran Minh Quang via <a className="text-blue-600" href="mailto: quangtran@hcmut.edu.vn">quangtran@hcmut.edu.vn</a> if you have any queries.</p>
      <p>Please contact us, either <a className="text-blue-400" href="mailto: hieu.le@hcmut.edu.vn">Hieu</a> or <a className="text-blue-400" href="mailto: duy.tran240203@hcmut.edu.vn">Duy</a> if you have found any defect.</p>
    </div>
  </div>;
}
