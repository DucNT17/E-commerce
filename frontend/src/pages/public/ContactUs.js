import { Breadcrumb } from 'components'
import withBaseComponent from 'hocs/withBaseComponent'
import React from 'react'
import { FaHome, FaPhoneAlt, FaInfo } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const ContactUs = ({ location }) => {
    return (
        <div className='w-full'>
            <div className='h-[81px] bg-gray-100 flex justify-center items-center'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>Contact Us</h3>
                    <Breadcrumb category={location?.pathname?.replace('/', '')?.split('-')?.join(' ')} />
                </div>
            </div>
            <div className='w-main mx-auto flex flex-col my-8'>
                <div className='w-full'>
                    <iframe
                        title='map'
                        // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4661.48722016145!2d106.71711044071151!3d10.747744148693696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f7ee5677451%3A0xf91f9fa9627bbed5!2zNzIgVMOibiBN4bu5LCBUw6JuIFRodeG6rW4gVMOieSwgUXXhuq1uIDcsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1718817244552!5m2!1svi!2s"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5267.444325177083!2d105.839974597371!3d21.006838707649074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac71294bf0ab%3A0xc7e2d20e5e04a9da!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1718788784771!5m2!1svi!2s"
                        width="600"
                        height="450"
                        className='border-none w-full'
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
                <div className='w-full mt-8 flex gap-8'>
                    <div className='flex-1'>
                        <span className='font-semibold uppercase text-xl text-gray-700'>Contact</span>
                        <form action=''>
                            <div className='mt-4 flex gap-2'>
                                <input
                                    placeholder='Name'
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    className='w-1/2 p-2 placeholder:text-gray-500 bg-gray-200 placeholder:text-sm placeholder:italic'
                                />
                                <input
                                    placeholder='Email'
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="w-1/2 p-2 placeholder:text-gray-500 bg-gray-200 placeholder:text-sm placeholder:italic"
                                />
                            </div>
                            <div className='mt-2'>
                                <input
                                    placeholder='Phone Number'
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    autoComplete="phone"
                                    className="w-full p-2 placeholder:text-gray-500 bg-gray-200 placeholder:text-sm placeholder:italic"
                                />
                            </div>
                            <div className='mt-2'>
                                <textarea
                                    placeholder='Message'
                                    id="message"
                                    name="mesage"
                                    rows={6}
                                    className="w-full p-2 placeholder:text-gray-500 bg-gray-200 placeholder:text-sm placeholder:italic"
                                />
                            </div>
                            <button type='submit' className='px-4 py-2 bg-main text-white mt-2'>
                                SEND
                            </button>
                        </form>
                    </div>
                    <div className='flex-1'>
                        <h3 className='font-semibold uppercase text-xl text-gray-700'>Get in touch with us</h3>
                        <ul className='list-none mt-4'>
                            <li className='flex items-center gap-4 mb-4'>
                                <FaHome size={18} color='gray' />
                                <span className='text-sm text-gray-700'>Address: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội.</span>
                            </li>
                            <li className='flex items-center gap-4 mb-4'>
                                <FaPhoneAlt size={18} color='gray' />
                                <span className='text-sm text-gray-700'>Phone Number: 0985366185</span>
                            </li>
                            <li className='flex items-center gap-4 mb-4'>
                                <IoMail size={18} color='gray' />
                                <span className='text-sm text-gray-700'>Email: tienducnguyen174@gmail.com</span>
                            </li>
                            <li className='flex gap-4 mb-4'>
                                <FaInfo size={18} color='gray' />
                                <span className='text-sm text-gray-700 flex flex-col'>
                                    <span>
                                        Opening hours
                                    </span>
                                    <span>
                                        Mon-Fri : 11.00 - 20.00
                                        <br/>
                                        Sat: 10.00 - 20.00
                                        <br/>
                                        Sun: 19.00 - 20.00
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withBaseComponent(ContactUs)