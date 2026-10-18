import { NavLink } from 'react-router-dom';

import UserProfileSummary from '../../features/profile/components/UserProfileSummary/UserProfileSummary';
import Button from '../../shared/ui/Button/Button';
import BackgroundDecoration from '../background/BackgroundDecoration';
import { paths } from '../routes';
import { navigationItems } from './navigationItems';
import { useNavigationMenu } from './useNavigationMenu';

import './Navigation.css';

/**
 * Affiche la navigation principale et l’accès au profil. Construit les liens à partir de
 * navigationItems et utilise NavLink pour signaler la page active.
 */
export default function Navigation() {
    const navigationAssets: Record<string, string> = {
        [paths.home]: 'house', [paths.online]: 'users1', [paths.computer]: 'bot1',
        [paths.ranking]: 'trophy1', [paths.settings]: 'settings',
    }
    const mobileAssets: Record<string, string> = {
        [paths.home]: 'icone-de-navigation', [paths.online]: 'icone-de-navigation1',
        [paths.computer]: 'icone-de-navigation2', [paths.ranking]: 'icone-de-navigation3',
        [paths.settings]: 'icone-de-navigation4',
    }
    const { isMenuOpen, menuToggleRef, closeMenu, toggleMenu} = useNavigationMenu()

    return (
        <aside className={`sidebar${isMenuOpen ? ' sidebar--open' : ''}`} aria-label="Navigation principale">
            {isMenuOpen && <BackgroundDecoration menu />}
            <div className="sidebar__top">
                <div className="sidebar__brand">
                    <NavLink className="sidebar__brand-link" to={paths.home} onClick={closeMenu}>
                        <span className="sidebar__brand-mark" aria-hidden="true">
                            <img className="sidebar__brand-x" src="/figma/home/menu-symbole.svg" alt="" />
                            <img className="sidebar__brand-o" src="/figma/home/menu-symbole1.svg" alt="" />
                        </span>
                        <span className="sidebar__brand-name">Morpion</span>
                    </NavLink>
                    <p className="sidebar__brand-text">{isMenuOpen ? 'Défie tes amis, aligne trois symboles. Gagne.' : 'Aligne trois symboles. Gagne.'}</p>
                </div>
                <Button
                    ref={menuToggleRef}
                    className="sidebar__menu-toggle"
                    variant='text'
                    aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                    onClick={toggleMenu}
                >
                    {isMenuOpen 
                        ? <img src="/figma/home/menu-fermer-le-menu.svg" alt="" /> 
                        : <img src="/figma/home/mobile-menu.svg" alt="" />
                    }
                </Button>
            </div>
            <nav
                className={`sidebar__nav${isMenuOpen ? ' sidebar__nav--open' : ''}`}
                id="primary-navigation"
                aria-label="Pages"
            >
                <span className="sidebar__nav-heading">Menu</span>
                {navigationItems.map(({ label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === paths.home}
                        className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
                        onClick={closeMenu}
                    >
                        <picture className="sidebar__link-icon" aria-hidden="true">
                            <source media="(min-width: 901px)" srcSet={"/figma/home/home-" + navigationAssets[path] + ".svg"} />
                            <img src={"/figma/home/menu-" + mobileAssets[path] + ".svg"} alt="" />
                        </picture>
                        <span className="sidebar__link-label">{label}</span>
                    </NavLink>
                ))}
            </nav>

            <NavLink
                to={paths.profile}
                className={({ isActive }) => `sidebar__profile${isActive ? ' sidebar__profile--active' : ''}${isMenuOpen ? ' sidebar__profile--menu-open' : ''}`}
                onClick={closeMenu}
            >
                <UserProfileSummary />
            </NavLink>
        </aside>
    );
}
