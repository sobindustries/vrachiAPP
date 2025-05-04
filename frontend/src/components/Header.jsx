import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar
} from '@nextui-org/react';
import useAuthStore from '../stores/authStore';

function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Обработчики навигации
  const handleProfileClick = () => navigate('/profile');
  const handleHistoryClick = () => navigate('/history');
  const handleSearchDoctorsClick = () => navigate('/search-doctors');
  const handleLogout = () => logout();
  
  // Получаем первые буквы имени для аватара
  const getAvatarText = () => {
    if (!user) return '?';
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  };
  
  return (
    <Navbar 
      maxWidth="xl" 
      isBordered
      className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Логотип и меню-гамбургер для мобильных устройств */}
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2 transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary mr-1">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">MedCare</span>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      
      {/* Логотип для десктопа */}
      <NavbarContent className="hidden sm:flex">
        <NavbarBrand>
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2 transition-all hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary mr-1">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">MedCare</span>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      
      {/* Ссылки навигации для десктопа */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {isAuthenticated && (
          <>
            <NavbarItem>
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors relative group">
                Главная
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </NavbarItem>
            
            {user?.role === 'patient' && (
              <NavbarItem>
                <Link to="/search-doctors" className="text-gray-700 hover:text-primary transition-colors relative group">
                  Найти врача
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </NavbarItem>
            )}
            
            <NavbarItem>
              <Link to="/history" className="text-gray-700 hover:text-primary transition-colors relative group">
                История
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      
      {/* Правая часть навигации */}
      <NavbarContent justify="end">
        {isAuthenticated ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                color="primary"
                size="sm"
                name={getAvatarText()}
                className="transition-transform cursor-pointer hover:scale-110 hover:shadow-md"
              />
            </DropdownTrigger>
            
            <DropdownMenu aria-label="Профиль пользователя" className="shadow-xl rounded-xl">
              <DropdownItem key="profile" textValue="Профиль" className="py-3">
                <div className="flex flex-col">
                  <span className="font-semibold">{user?.profile?.firstName || user?.email}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </DropdownItem>
              
              <DropdownItem key="role" textValue="Роль" className="text-gray-500 text-xs py-2" isReadOnly>
                {user?.role === 'patient' ? 'Пациент' : 'Врач'}
              </DropdownItem>
              
              <DropdownItem key="settings" onPress={handleProfileClick} className="py-2.5 hover:bg-blue-50">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Настройки профиля
                </div>
              </DropdownItem>
              
              <DropdownItem key="history" onPress={handleHistoryClick} className="py-2.5 hover:bg-blue-50">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  История
                </div>
              </DropdownItem>
              
              {user?.role === 'patient' && (
                <DropdownItem key="search" onPress={handleSearchDoctorsClick} className="py-2.5 hover:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Найти врача
                  </div>
                </DropdownItem>
              )}
              
              <DropdownItem key="logout" color="danger" onPress={handleLogout} className="py-2.5">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Выйти
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : null}
      </NavbarContent>
      
      {/* Мобильное меню */}
      <NavbarMenu className="bg-gradient-to-b from-blue-50 to-white pt-6">
        {isAuthenticated ? (
          <>
            <NavbarMenuItem>
              <Link to="/" className="w-full py-2 text-gray-700 hover:text-primary transition-colors">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Главная
                </div>
              </Link>
            </NavbarMenuItem>
            
            {user?.role === 'patient' && (
              <NavbarMenuItem>
                <Link to="/search-doctors" className="w-full py-2 text-gray-700 hover:text-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Найти врача
                  </div>
                </Link>
              </NavbarMenuItem>
            )}
            
            <NavbarMenuItem>
              <Link to="/history" className="w-full py-2 text-gray-700 hover:text-primary transition-colors">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  История
                </div>
              </Link>
            </NavbarMenuItem>
            
            <NavbarMenuItem>
              <Link to="/profile" className="w-full py-2 text-gray-700 hover:text-primary transition-colors">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Настройки профиля
                </div>
              </Link>
            </NavbarMenuItem>
            
            <NavbarMenuItem>
              <div className="w-full py-2 cursor-pointer text-red-600 hover:text-red-700 transition-colors" onClick={handleLogout}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Выйти
                </div>
              </div>
            </NavbarMenuItem>
          </>
        ) : null}
      </NavbarMenu>
    </Navbar>
  );
}

export default Header; 