import React from 'react';
import whatsappIcon from '../../assets/images/icons/whatsapp.svg'
import './styles.css'


function TeacherItem(){
  return(
    <article className="teacher-item">
      <header>
        <img src="https://avatars.githubusercontent.com/u/53455496?s=460&u=df941bb8403e50eb305e55a9da57c557fe58fb89&v=4" alt="Marcos Fillipe"/>
        <div>
          <strong>
            Marcos Fillipe
          </strong>
          <span>Anapropegua</span>
        </div>
      </header>

      <p>
        Faz tudo, analista, programador e fi duma egua!
        <br/>
        Mias conhecidog como bombril! Mil e uma funções
      </p>
      <footer>
        <p>
          Preço/Hora
          <strong>R$ 250,00</strong>
        </p>
        <button>
          <img src={whatsappIcon} alt="whatsapp"/>
          Entrar em Contato
        </button>
      </footer>

    </article>
  );
}

export default TeacherItem;