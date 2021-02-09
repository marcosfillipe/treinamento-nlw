import React, { ChangeEvent, FormEvent, useEffect, useState, } from 'react'
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios';

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface UFResponse{
    geonames: {
        geonameId: number;
        adminCodes1: {
            ISO3166_2: string;
        };
    }[];
}

interface CityResponse{
    geonames:{
        name: string;
    }[];
}

interface Uf {
    uf: string; 
    geonameId: number
}



const CreatePoint = () => {

    const [initialPosition, setinitialPosition] = useState<[number, number]>([0,0]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedUf, setSeletedUf] = useState('');
    const [selectedCity, setSeletedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    
    const history = useHistory();


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setinitialPosition([latitude, longitude]);
        })
    }, []);


    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    
    //Chamada para a API de estados
    const [ufs, setUfs] = useState([] as Uf[]);
    useEffect(() => {
        axios.get<UFResponse>(
            'http://www.geonames.org/childrenJSON?geonameId=3469034').then(response => {
          const ufInitials = response.data.geonames.map((uf) =>{
              return { uf: uf.adminCodes1.ISO3166_2, geonameId: uf.geonameId };
          })
          setUfs(ufInitials);
        });
    }, [selectedUf]);

    const [est, setEst] = useState<{estado: string}[]>([]);
    useEffect(() => {
        console.log(selectedUf)
        if(selectedUf){
        axios.get<CityResponse>(`http://www.geonames.org/childrenJSON?geonameId=${selectedUf}`).then(response => {

            const estInitials = response.data.geonames.map((est) => {
                return { estado: est.name};
            });

            setEst(estInitials);
        
              
          })
        }

    }, [selectedUf]);
    
   
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSeletedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSeletedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);

    }

    function handleInoutChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;


        setFormData({ ...formData, [name]: value });
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([ ...selectedItems, id]);
        }
        

    }

    async function handleSubmit(event: FormEvent){

        event.preventDefault();
        const selecUf=  ufs.find(uf => uf.geonameId === Number(selectedUf));

        const { name, email, whatsapp} = formData;
        // eslite 
        const uf = selecUf?.uf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        
        await api.post('points', data);

        alert('Ponto de coleta criado!');

        history.push('/');

    }

    return(
        <div id="page-create-point">
            <header>
                
                    <img src={logo} alt="Ecoleta" />
                    
                    <Link to="/">
                        <FiArrowLeft/>
                        Voltar para home
                    </Link>
                    
                
            </header>
            <form onSubmit={handleSubmit}>

                <h1>Cadastro do <br/> Ponto de Coleta</h1>  

            <fieldset>
                <legend>
                    <h2>Dados</h2>
                </legend>

                <div className="field">
                    <label htmlFor="name">Nome da Entidade</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleInoutChange}
                    />
                </div>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInoutChange}
                        />
                    </div>
                    <div className="field">
                    <label htmlFor="whatsapp">Whatsapp</label>
                    <input
                        type="text"
                        name="whatsapp"
                        id="whatsapp"
                        onChange={handleInoutChange}
                    />
                </div>  
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    <h2>Endereço</h2>
                    <span>Selecione o endereço no mapa</span>
                </legend>

                <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={selectedPosition}/>
                </Map>



                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado(UF)</label>
                        <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                            <option value="0">Selecione uma UF</option>
                            {ufs.map(uf => (
                                <option key={uf.uf} value={uf.geonameId}>{uf.uf}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                            <option value="0">Selecione uma Cidade</option>
                            {est.map(est => (
                                <option key={est.estado} value={est.estado}>{est.estado}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    <h2>Ítens de Coleta</h2>
                    <span>Selecione um ou mais ítens abaixo</span>
                </legend>

                <ul className="items-grid">
                    {items.map(item => (
                    <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                      <img src={item.image_url} alt={item.title} />
                      <span>{item.title}</span>
                    </li>
                    ))}
                    
                </ul>
            </fieldset>

            <button type="submit">
                Cadastrar ponto de coleta
            </button>
            </form>
        </div>
    );

};

export default CreatePoint;