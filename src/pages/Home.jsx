import Profile from '../components/users/home/profile';
import Worklist from '../components/users/home/worklist';

const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-24 w-[95vw] sm:w-[80vw] p-2 sm:pt-0 sm:p-10'>
            <h2 className='text-[30px] font-bold'>
                マイページ
            </h2>
            <div className='flex flex-col justify-center gap-16 w-full md:flex-row'>
                <Profile />
                <Worklist />
            </div>
        </div>
    )
}

export default Home;