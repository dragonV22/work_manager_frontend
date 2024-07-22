import { useEffect, useState } from "react";
import { axiosTokenApi } from "../../../utils/axios";
import Modal from 'react-modal';


const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: '90vw',
		padding: '3rem',
		maxWidth: '800px'
	},
};

const Profile = () => {

	const [name, setName] = useState("");
	const [isValidName, setIsValidName] = useState(true);
	const [nameError, setNameError] = useState('');
	const [email, setEmail] = useState("");
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [emailError, setEmailError] = useState('');
	const [address, setAddress] = useState("");
	const [tel, setTel] = useState("");
	const [isValidTel, setIsValidTel] = useState(true);
	const [telError, setTelError] = useState('');
	const [modalIsOpen, setIsOpen] = useState(false);

	useEffect(() => {
		getProfile();
	}, [])

	const getProfile = () => {
		axiosTokenApi.post("/api/auth/user/")
			.then(res => {
				const profile = res.data;
				setName(profile.name);
				setEmail(profile.email);
				setAddress(profile.address);
				setTel(profile.tel);
			})
			.catch(err => {
				console.log(err)
			});
	};

	let subtitle;

	function openModal() {
		setIsOpen(true);
	}

	function afterOpenModal() {
		subtitle.style.color = '#f00';
	}

	function closeModal() {
		setIsOpen(false);
		setNameError("");
		setEmailError("");
		setTelError("");
		getProfile();
	}

	const handleProfileUpdate = () => {
		axiosTokenApi
			.post('api/auth/profile/', {
				email: email,
				name: name,
				tel: tel,
				address: address
			})
			.then(() => {
				setIsOpen(false);
				setNameError("");
				setEmailError("");
				setTelError("");
				getProfile();
			})
			.catch((err) => {
				const ret = err.response.data;
				
				if(ret.email) {
					setEmailError(ret.email);
					setIsValidEmail(false);
				} else{
					setEmailError('');
					setIsValidEmail(true);
				}

				if(ret.name) {
					setNameError(ret.name);
					setIsValidName(false);
				} else{
					setNameError('');
					setIsValidName(true);
				}

				if(ret.tel) {
					setTelError(ret.tel);
					setIsValidTel(false);
				} else{
					setTelError('');
					setIsValidTel(true);
				}
			})
	}

	return (
		<div className="w-full md:w-[65%] lg:w-[48%] relative">
			<h2 className="text-right text-[24px] font-semibold">
			プロフィール
			</h2>
			<div className="relative w-full p-5 sm:p-10 pt-20 border border-solid border-[#33333333] rounded-xl flex flex-col gap-5">
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						名前
					</p>
					<p>
						{name}
					</p>
				</div>
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						メールアドレス
					</p>
					<p>
						{email}
					</p>
				</div>
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						住所
					</p>
					<p>
						{address}
					</p>
				</div>
				<div className="flex gap-6 items-center border-b border-solid border-[#33333333]">
					<p className="w-6/12">
						電話番号
					</p>
					<p>
						{tel}
					</p>
				</div>
				<div className="absolute top-2 right-2" id="yourAppElement">
					<button onClick={openModal} className="bg-[#0EAAF0] text-white font-medium text-[18px] px-4 py-2">
						編集
					</button>
					<Modal
						isOpen={modalIsOpen}
						onAfterOpen={afterOpenModal}
						onRequestClose={closeModal}
						style={customStyles}
						contentLabel="ProfileUpdate Modal"
						
					>
						<h2 className="text-2xl mb-10 sm:mb-20 sm:text-4xl" ref={(_subtitle) => (subtitle = _subtitle)}>プロフィールの編集</h2>
						<div className="flex flex-col gap-4">
							<div className="flex">
								<p className="w-1/3">名前</p>
								<div className="w-2/3">
									<input type="text"
										required
										className="border border-solid border-[#33333333] p-2 text-[14px] w-full"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
									{isValidName === false &&
										<p className='pl-2 text-xs text-red-500'>{nameError}</p>
									}
								</div>
							</div>
							<div className="flex">
								<p className="w-1/3">メールアドレス</p>
								<div className="w-2/3">
									<input type="email"
										required
										className="border border-solid border-[#33333333] p-2 text-[14px] w-full"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
									{isValidEmail === false &&
										<p className='pl-2 text-xs text-red-500'>{emailError}</p>
									}
								</div>
							</div>
							<div className="flex">
								<p className="w-1/3">住所</p>
								<div className="w-2/3">
									<input 
										type="text"
										className="border border-solid border-[#33333333] p-2 text-[14px] w-full"
										value={address}
										onChange={(e) => setAddress(e.target.value)}
									/>
								</div>
							</div>
							<div className="flex">
								<p className="w-1/3">電話番号</p>
								<div className="w-2/3">
									<input
										type="text"
										required
										className="border border-solid border-[#33333333] p-2 text-[14px] w-full"
										value={tel}
										onChange={(e) => setTel(e.target.value)}
									/>
									{isValidTel === false &&
										<p className='pl-2 text-xs text-red-500'>{telError}</p>
									}
								</div>
							</div>
						</div>
						<div className="flex gap-3 justify-center mt-6">
							<button onClick={handleProfileUpdate} className="bg-[#0EAAF0] text-white font-medium text-[14px] sm:text-[18px] w-28">
								保存
							</button>
							<button className="bg-[#e27d7d] text-white font-medium text-[14px] sm:text-[18px] w-40" onClick={closeModal}>
								キャンセル
							</button>
						</div>
					</Modal>
				</div>
			</div>
			<div className="absolute top-[-20px] left-0 w-20">
				<img src="/assets/img/profile_img.png" alt="profile_img" />
			</div>
		</div>
	)
}


export default Profile;