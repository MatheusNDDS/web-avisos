clear
echo -e "-- Atualizador do Web Avisos --"
read -p "
Todos os arquivos da pasta “main” serão permanentemente substituidos pelos da “dev”.

Deseja continuar?
(sim/não): " yn

case "$(echo $yn| tr [:upper] [:lower])" in
	"sim")
		clear
		echo -e "-- atualizando --"
		echo -e "-Antes:"
		ls -l main/
		rm -rf main/*
		cp -r dev/* main/
		echo -e "\n-depois:"
		ls -l main/
	;;
	*)
		clear
		echo -e "-- cancelado --"
	;;
esac

exit
