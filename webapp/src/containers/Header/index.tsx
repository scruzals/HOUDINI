import { Link } from 'react-router-dom';
import GitHubButton from "react-github-btn";
import WhaleIcon from 'assets/whale.png';

const Header = () => {
    return (
        <>
            <header className="container mx-auto py-6 font-Karla">
                <h1 className="text-6xl text-center select-none flex justify-center align-center">
                    <Link to={`/`} className='no-underline text-slate-600 hover:text-slate-900'>
                        <img src={WhaleIcon} className="inline h-12" alt="Whale" />
                        <span className="font-semibold ml-2">HOUDINI</span>
                    </Link>

                </h1>
                
                <div className="flex justify-center mt-2">
                    <GitHubButton href="https://github.com/cybersecsi/HOUDINI" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star cybersecsi/HOUDINI on GitHub">Star</GitHubButton>
                </div>

                <h2 className="text-3xl text-center mt-6 font-normal">Hundreds of Offensive and Useful Docker Images for Network Intrusion</h2>
            </header>

        </>
    )
}

export default Header;